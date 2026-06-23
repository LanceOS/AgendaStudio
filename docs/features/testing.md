# Testing & Reliability

- **Comprehensive Test Suite:** The codebase is thoroughly tested using **Vitest**.
- **Isolated Database Tests:** Backend repositories are tested against a real, isolated PostgreSQL test database (`agendastudio_test`) to guarantee data integrity without polluting development data.
- **CI/CD Integration:** GitHub Actions automatically runs the test suite on every push and pull request, enforcing a minimum code coverage threshold.
