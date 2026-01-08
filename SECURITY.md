# Security Policy

## 🔐 Secrets Management

### Environment Variables (REQUIRED)

Never commit secrets to the repository. Always use environment variables:

```bash
# Good - uses environment variable
CLICKUP_PERSONAL_TOKEN=$(cat .env.local | grep CLICKUP_PERSONAL_TOKEN)

# Bad - hardcoded in file
CLICKUP_PERSONAL_TOKEN="pk_123456789..."
```

### Required Files in .gitignore

These files contain secrets and are protected:

```
.env                     # Local development
.env.local              # Local overrides
.env.*.local            # Environment-specific local
.env.integration        # Integration test secrets
.cursor/                # IDE configuration with credentials
```

### Setup Instructions

1. **Development Environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual ClickUp API token
   export $(cat .env.local | xargs)
   ```

2. **Integration Testing**:
   ```bash
   cp .env.integration.example .env.integration
   # Edit .env.integration with a TEST workspace token
   npm run test:integration
   ```

3. **Production Deployment**:
   - Use environment variable injection from your deployment platform
   - Never use .env files in production
   - Example with Docker:
     ```bash
     docker run -e CLICKUP_PERSONAL_TOKEN="your_token" clickup-mcp-server
     ```

## 🚨 Exposed Secrets - History Cleanup

If you suspect secrets have been committed, follow these steps:

### 1. Rotate Your ClickUp API Token
- Go to: https://app.clickup.com/settings/integrations/api
- Regenerate your personal token immediately
- Update all environments with the new token

### 2. Remove from Git History (One-time cleanup)

**WARNING**: This rewrites git history. Only do this once when secrets are first exposed.

```bash
# Option A: Using git-filter-branch (safer)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.integration' \
  --prune-empty --tag-name-filter cat -- --all

# Option B: Using BFG (faster for large repos)
bfg --delete-files .env.integration
```

### 3. Force Push (Only if absolutely necessary)

```bash
# Notify all developers BEFORE doing this
git push origin --force --all
git push origin --force --tags
```

## ✅ Security Best Practices

### Pre-commit Hook

A git pre-commit hook automatically prevents committing secrets:

```bash
# Already configured in .githooks/pre-commit
# It checks for:
# - API key patterns (pk_*, sk_*)
# - .env file commits
```

The hook is automatically enabled when cloning.

### What NOT to do

❌ Never hardcode tokens in:
- Source code
- Configuration files (except .env.example which uses placeholders)
- Git commits
- Docker images (use environment variables instead)
- README.md or documentation

### What TO do

✅ Always:
- Use environment variables for secrets
- Keep .env files in .gitignore
- Use .env.example with placeholder values
- Rotate tokens if accidentally exposed
- Use secrets management in CI/CD (GitHub Secrets, etc.)

## 🔍 Scanning for Secrets

### Local Scanning

Check your working directory for accidentally exposed secrets:

```bash
# Search for API key patterns
grep -r "pk_[0-9a-zA-Z_]\{30,\}" . --exclude-dir=node_modules --exclude-dir=.git

# Search for common secret patterns
grep -r "CLICKUP_PERSONAL_TOKEN.*['\"]" . --exclude-dir=node_modules --exclude-dir=.git
```

### Using Secret Scanning Tools

Install tools to automatically scan for secrets:

```bash
# Option 1: git-secrets
brew install git-secrets
git secrets --install
git secrets --register-aws

# Option 2: detect-secrets
pip install detect-secrets
detect-secrets scan --all-files

# Option 3: Semgrep
semgrep --config=p/owasp-top-ten
```

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Security Scan
on: [push, pull_request]
jobs:
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

## 📋 Checklist for Contributors

Before committing:

- [ ] No hardcoded API keys in any file
- [ ] All secrets in .env.local (not .env)
- [ ] .env files are in .gitignore
- [ ] Pre-commit hook passed (automatic)
- [ ] Verified with: `git diff --cached | grep -E "pk_|sk_"`

## 🆘 Emergency Response

If secrets ARE committed:

1. **Immediately**: Rotate the token at https://app.clickup.com/settings/integrations/api
2. **Within 24h**: Clean git history using steps above
3. **Notify**: Alert your team about the rotation
4. **Prevent**: Ensure pre-commit hook is enabled

## 📚 References

- [ClickUp API Documentation](https://clickup.com/api)
- [OWASP Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)
- [Git Secrets Prevention](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)

## Questions?

For security concerns or questions about this policy, please create an issue or contact the maintainers.

---

**Last Updated**: 2026-01-07
**Version**: 1.0.0
