# Python Editor Embed

<a href="https://microbit-foundation.github.io/python-editor-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

This is a React/JavaScript library for embedding micro:bit Python Editor as an iframe.

It is intended to be used by other Micro:bit Educational Foundation projects
that need to embed Python Editor and, when the API stabilises, to be useful to others
who embed MakeCode.

## Release process

This project deploys releases to NPM CircleCI for version tags. (e.g. v1.0.0).
This requires the `NPM_AUTH_TOKEN` environment variable to be available to the
build.

@next scoped releases are also pushed for builds on main.

As the project uses a scope, the published packages are private by default.
To change this set the access to public when pushing (or in `.npmrc`).

Distinct semver versions are generated for branches, so it is safe to extend
the CI config to push all builds to NPM if this is helpful.

Steps:

1. Ensure main is up-to-date and has no local changes.
1. Update CHANGELOG.md, moving content from unreleased to the new version.
1. Tag the new version `git tag -a v1.0.0`. Use the changelog text as the
   message.
1. Push the new tag, `git push origin v1.0.0`.
1. The CI build will push `@microbit-foundation/python-editor-embed@1.0.0`
