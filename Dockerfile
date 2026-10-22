FROM node:22-alpine

# Shopify CLI for theme development.
# Version pinned to a release published at least 7 days ago.
RUN npm install -g @shopify/cli@4.9.3

# The CLI tries to open a browser via xdg-open, which doesn't exist in a
# container and crashes the login flow. A no-op stub lets device auth
# continue; the login URL is printed in the container logs instead.
RUN printf '#!/bin/sh\nexit 0\n' > /usr/local/bin/xdg-open && chmod +x /usr/local/bin/xdg-open

WORKDIR /theme

EXPOSE 9292

CMD ["shopify", "theme", "dev", "--host", "0.0.0.0", "--port", "9292"]
