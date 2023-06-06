{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  shellHook = ''
    export LANG=en_US.UTF-8
  '';
  packages = [
    pkgs.nodejs_18
    pkgs.nodePackages.pnpm
  ];
}