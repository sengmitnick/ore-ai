{ pkgs ? import <nixpkgs> { overlays = [(import /etc/nix/nixpkgs-showmebug/overlay.nix)];} }:
pkgs.mkShell {
    shellHook = ''
        alias ll="ls -l"
        export PS1="\[\e[0m\]\w\[\e[0m\]#\[\e[0m\] "
        export LANG=en_US.UTF-8
        export npm_config_prefix="$HOME/app/.config/npm/node_global"
        export PATH=$HOME/app/node_modules/.bin:$npm_config_prefix/bin:$PATH
        export DB_NAME=ore_ai_db
        export LOCAL_HOST="http://localhost:8080"
        export API_URL="https://llm.1024code.com/v1"
        export API_KEY="e024-3vv8QuHbER4guU2O1LVdWbDWEmU0FtqZ"
    '';
    packages = [
        # env
        pkgs.nodejs-18_x
        pkgs.nodePackages.pnpm
        pkgs.nodePackages.yarn
        pkgs.nodePackages.typescript
        pkgs.replitPackages.jest
        pkgs.nodePackages.browser-sync
        pkgs.mysql57
        # lsp
        pkgs.nodePackages.typescript-language-server
        pkgs.glibcLocales
    ];
}