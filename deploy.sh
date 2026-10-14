#!/usr/bin/env bash
# Portfolio Helper Script: status, local preview, and deployment
# Usage:
#   bash portfolio/deploy.sh status
#   bash portfolio/deploy.sh preview [port]
#   bash portfolio/deploy.sh sync-cv
#   bash portfolio/deploy.sh deploy "Commit message"

set -euo pipefail

PORTFOLIO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$PORTFOLIO_DIR/.." && pwd)"
ROOT_PDF="$ROOT_DIR/Mohamed_Helmy_Resume.pdf"
ASSET_PDF="$PORTFOLIO_DIR/assets/Mohamed_Helmy_Resume.pdf"

CMD="${1:-status}"

check_pdf_sync() {
    if [ ! -f "$ROOT_PDF" ]; then
        echo "⚠️  Root CV not found at $ROOT_PDF. Run ./cv_latex/build.sh first."
        return 1
    fi
    if [ ! -f "$ASSET_PDF" ] || ! cmp -s "$ROOT_PDF" "$ASSET_PDF"; then
        echo "⚠️  Portfolio CV ($ASSET_PDF) differs from root CV ($ROOT_PDF)."
        return 1
    else
        echo "✅ Portfolio CV is in sync with root CV."
        return 0
    fi
}

sync_pdf() {
    if [ -f "$ROOT_PDF" ]; then
        mkdir -p "$PORTFOLIO_DIR/assets"
        cp "$ROOT_PDF" "$ASSET_PDF"
        echo "✅ Copied $ROOT_PDF -> $ASSET_PDF"
    else
        echo "❌ Root CV ($ROOT_PDF) does not exist. Run ./cv_latex/build.sh first."
        exit 1
    fi
}

case "$CMD" in
    status)
        echo "=== Portfolio Status ==="
        check_pdf_sync || echo "💡 Run 'bash portfolio/deploy.sh sync-cv' or './cv_latex/build.sh' to sync."
        echo ""
        echo "=== Git Status (portfolio) ==="
        git -C "$PORTFOLIO_DIR" status -s
        ;;

    preview)
        PORT="${2:-4173}"
        echo "🚀 Starting local server at http://localhost:$PORT"
        echo "Press Ctrl+C to stop."
        cd "$PORTFOLIO_DIR"
        python3 -m http.server "$PORT"
        ;;

    sync-cv)
        sync_pdf
        ;;

    deploy)
        COMMIT_MSG="${2:-Update portfolio and resume assets}"
        echo "=== Deploying Portfolio to GitHub Pages ==="
        
        # Verify and sync PDF
        if ! check_pdf_sync; then
            echo "==> Synchronizing latest CV PDF into portfolio/assets/..."
            sync_pdf
        fi

        cd "$PORTFOLIO_DIR"
        
        if [ -z "$(git status --porcelain)" ]; then
            echo "✨ Working tree clean. Nothing to deploy."
            exit 0
        fi

        echo "==> Staging changes..."
        git add .
        echo "==> Committing with message: '$COMMIT_MSG'..."
        git commit -m "$COMMIT_MSG"
        echo "==> Pushing to origin main..."
        git push origin main
        echo ""
        echo "🎉 Successfully deployed! Your changes will be live shortly at:"
        echo "   https://helmy2.github.io/"
        ;;

    *)
        echo "Usage: bash portfolio/deploy.sh [status|preview|sync-cv|deploy [message]]"
        exit 1
        ;;
esac
