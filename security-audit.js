#!/usr/bin/env node

/**
 * Wedding Website Security Audit Script
 * 
 * Comprehensive security scanning and validation for production deployment.
 * Checks for common vulnerabilities, security headers, and best practices.
 * 
 * @author Wedding Website Team
 * @version 2.0.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Security Audit Configuration
 */
const AUDIT_CONFIG = {
    // Files to scan for security issues
    scanFiles: [
        'index.html',
        'js/scripts.js',
        'js/scripts.min.js',
        'css/styles.css',
        'css/styles.min.css'
    ],
    
    // Required security headers
    requiredHeaders: [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy'
    ],
    
    // Dangerous patterns to detect
    dangerousPatterns: [
        /document\.write\s*\(/gi,
        /eval\s*\(/gi,
        /innerHTML\s*=/gi,
        /outerHTML\s*=/gi,
        /javascript:/gi,
        /on\w+\s*=/gi, // onclick, onload, etc.
        /AIzaSy[a-zA-Z0-9_-]{33}/g, // Google API keys
        /sk_live_[a-zA-Z0-9]{24}/g, // Stripe keys
        /pk_live_[a-zA-Z0-9]{24}/g, // Stripe keys
        /AKIA[0-9A-Z]{16}/g, // AWS keys
        /password\s*[:=]\s*['"]/gi,
        /secret\s*[:=]\s*['"]/gi
    ],
    
    // Required CSP directives
    requiredCSP: [
        "default-src 'self'",
        "script-src",
        "style-src",
        "img-src",
        "connect-src",
        "font-src"
    ]
};

/**
 * Security Audit Results
 */
class SecurityAudit {
    constructor() {
        this.results = {
            score: 0,
            maxScore: 0,
            issues: [],
            warnings: [],
            passed: []
        };
    }

    /**
     * Add a security check result
     */
    addResult(type, message, severity = 'medium') {
        const points = severity === 'high' ? 20 : severity === 'medium' ? 10 : 5;
        
        this.results.maxScore += points;
        
        if (type === 'pass') {
            this.results.score += points;
            this.results.passed.push(message);
        } else if (type === 'warning') {
            this.results.score += Math.floor(points / 2);
            this.results.warnings.push({ message, severity });
        } else {
            this.results.issues.push({ message, severity });
        }
    }

    /**
     * Get final security score
     */
    getScore() {
        return this.results.maxScore > 0 
            ? Math.round((this.results.score / this.results.maxScore) * 100)
            : 0;
    }

    /**
     * Generate audit report
     */
    generateReport() {
        const score = this.getScore();
        const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
        
        console.log('\n' + '='.repeat(60));
        console.log('🔒 WEDDING WEBSITE SECURITY AUDIT REPORT');
        console.log('='.repeat(60));
        console.log(`📊 Security Score: ${score}/100 (Grade: ${grade})`);
        console.log(`✅ Passed Checks: ${this.results.passed.length}`);
        console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
        console.log(`❌ Issues: ${this.results.issues.length}`);
        console.log('='.repeat(60));

        if (this.results.passed.length > 0) {
            console.log('\n✅ PASSED SECURITY CHECKS:');
            this.results.passed.forEach(check => {
                console.log(`  ✓ ${check}`);
            });
        }

        if (this.results.warnings.length > 0) {
            console.log('\n⚠️  SECURITY WARNINGS:');
            this.results.warnings.forEach(warning => {
                console.log(`  ⚠️  [${warning.severity.toUpperCase()}] ${warning.message}`);
            });
        }

        if (this.results.issues.length > 0) {
            console.log('\n❌ SECURITY ISSUES:');
            this.results.issues.forEach(issue => {
                console.log(`  ❌ [${issue.severity.toUpperCase()}] ${issue.message}`);
            });
        }

        console.log('\n' + '='.repeat(60));
        
        if (score >= 80) {
            console.log('🎉 Great job! Your website meets security standards.');
        } else if (score >= 60) {
            console.log('⚠️  Your website has some security concerns that should be addressed.');
        } else {
            console.log('🚨 Your website has serious security issues that must be fixed.');
        }
        
        console.log('='.repeat(60) + '\n');
        
        return score >= 80;
    }
}

/**
 * File Security Scanner
 */
class FileScanner {
    constructor(audit) {
        this.audit = audit;
    }

    /**
     * Scan file for security issues
     */
    scanFile(filePath) {
        if (!fs.existsSync(filePath)) {
            this.audit.addResult('warning', `File not found: ${filePath}`, 'low');
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);

        console.log(`🔍 Scanning ${fileName}...`);

        // Check for dangerous patterns
        AUDIT_CONFIG.dangerousPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                const patternName = this.getPatternName(pattern);
                this.audit.addResult('issue', 
                    `Dangerous pattern found in ${fileName}: ${patternName} (${matches.length} occurrences)`, 
                    'high'
                );
            }
        });

        // File-specific checks
        if (fileName.endsWith('.html')) {
            this.scanHTML(content, fileName);
        } else if (fileName.endsWith('.js')) {
            this.scanJavaScript(content, fileName);
        } else if (fileName.endsWith('.css')) {
            this.scanCSS(content, fileName);
        }
    }

    /**
     * Get human-readable pattern name
     */
    getPatternName(pattern) {
        const patternMap = {
            '/document\\.write\\s*\\(/gi': 'document.write() usage',
            '/eval\\s*\\(/gi': 'eval() usage',
            '/innerHTML\\s*=/gi': 'innerHTML assignment',
            '/outerHTML\\s*=/gi': 'outerHTML assignment',
            '/javascript:/gi': 'javascript: protocol',
            '/on\\w+\\s*=/gi': 'inline event handlers',
            '/AIzaSy[a-zA-Z0-9_-]{33}/g': 'Google API key',
            '/sk_live_[a-zA-Z0-9]{24}/g': 'Stripe secret key',
            '/pk_live_[a-zA-Z0-9]{24}/g': 'Stripe public key',
            '/AKIA[0-9A-Z]{16}/g': 'AWS access key',
            '/password\\s*[:=]\\s*[\'\"]/gi': 'hardcoded password',
            '/secret\\s*[:=]\\s*[\'\"]/gi': 'hardcoded secret'
        };
        
        return patternMap[pattern.toString()] || 'unknown pattern';
    }

    /**
     * Scan HTML content
     */
    scanHTML(content, fileName) {
        // Check for security headers
        const hasCSP = content.includes('Content-Security-Policy');
        if (hasCSP) {
            this.audit.addResult('pass', `${fileName}: Content Security Policy found`, 'high');
            this.validateCSP(content, fileName);
        } else {
            this.audit.addResult('issue', `${fileName}: Missing Content Security Policy`, 'high');
        }

        // Check for other security headers
        AUDIT_CONFIG.requiredHeaders.forEach(header => {
            if (content.includes(header)) {
                this.audit.addResult('pass', `${fileName}: ${header} header found`, 'medium');
            } else if (header !== 'Content-Security-Policy') {
                this.audit.addResult('warning', `${fileName}: Missing ${header} header`, 'medium');
            }
        });

        // Check for HTTPS enforcement
        if (content.includes('https://') && !content.includes('http://')) {
            this.audit.addResult('pass', `${fileName}: HTTPS enforcement detected`, 'medium');
        } else {
            this.audit.addResult('warning', `${fileName}: Mixed HTTP/HTTPS content detected`, 'medium');
        }

        // Check for noindex meta tag (privacy)
        if (content.includes('noindex')) {
            this.audit.addResult('pass', `${fileName}: Search engine indexing disabled (privacy)`, 'low');
        }
    }

    /**
     * Validate Content Security Policy
     */
    validateCSP(content, fileName) {
        const cspMatch = content.match(/Content-Security-Policy[^>]*content="([^"]+)"/i);
        if (!cspMatch) return;

        const csp = cspMatch[1];
        
        AUDIT_CONFIG.requiredCSP.forEach(directive => {
            if (csp.includes(directive.split(' ')[0])) {
                this.audit.addResult('pass', `${fileName}: CSP includes ${directive.split(' ')[0]} directive`, 'medium');
            } else {
                this.audit.addResult('warning', `${fileName}: CSP missing ${directive.split(' ')[0]} directive`, 'medium');
            }
        });

        // Check for unsafe CSP directives
        if (csp.includes("'unsafe-eval'")) {
            this.audit.addResult('issue', `${fileName}: CSP allows unsafe-eval`, 'high');
        }
        
        if (csp.includes("'unsafe-inline'")) {
            this.audit.addResult('warning', `${fileName}: CSP allows unsafe-inline`, 'medium');
        }
    }

    /**
     * Scan JavaScript content
     */
    scanJavaScript(content, fileName) {
        // Check for strict mode
        if (content.includes("'use strict'")) {
            this.audit.addResult('pass', `${fileName}: Strict mode enabled`, 'low');
        } else {
            this.audit.addResult('warning', `${fileName}: Strict mode not enabled`, 'low');
        }

        // Check for console.log in production
        if (fileName.includes('.min.') && content.includes('console.log')) {
            this.audit.addResult('warning', `${fileName}: Console statements in production build`, 'low');
        }

        // Check for proper error handling
        if (content.includes('try') && content.includes('catch')) {
            this.audit.addResult('pass', `${fileName}: Error handling implemented`, 'medium');
        }

        // Check for input validation
        if (content.includes('sanitize') || content.includes('validate')) {
            this.audit.addResult('pass', `${fileName}: Input validation/sanitization found`, 'high');
        }
    }

    /**
     * Scan CSS content
     */
    scanCSS(content, fileName) {
        // Check for external font loading
        if (content.includes('@import') && content.includes('fonts.googleapis.com')) {
            this.audit.addResult('pass', `${fileName}: Secure font loading from Google Fonts`, 'low');
        }

        // Check for !important overuse
        const importantCount = (content.match(/!important/g) || []).length;
        if (importantCount > 10) {
            this.audit.addResult('warning', `${fileName}: Excessive use of !important (${importantCount} occurrences)`, 'low');
        }
    }
}

/**
 * Dependency Security Scanner
 */
class DependencyScanner {
    constructor(audit) {
        this.audit = audit;
    }

    /**
     * Scan package.json for security issues
     */
    scanDependencies() {
        console.log('🔍 Scanning dependencies...');

        if (!fs.existsSync('package.json')) {
            this.audit.addResult('warning', 'package.json not found', 'medium');
            return;
        }

        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Check for security-related scripts
        if (packageJson.scripts && packageJson.scripts.security) {
            this.audit.addResult('pass', 'Security audit script configured', 'medium');
        }

        // Check for linting configuration
        if (packageJson.eslintConfig || fs.existsSync('.eslintrc.js')) {
            this.audit.addResult('pass', 'ESLint configuration found', 'low');
        }

        // Check for outdated dependencies (simplified check)
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        let outdatedCount = 0;
        
        Object.entries(deps).forEach(([name, version]) => {
            // Simple check for very old versions
            if (version.includes('^3.') || version.includes('^2.') || version.includes('^1.')) {
                outdatedCount++;
            }
        });

        if (outdatedCount === 0) {
            this.audit.addResult('pass', 'Dependencies appear up-to-date', 'medium');
        } else if (outdatedCount < 5) {
            this.audit.addResult('warning', `${outdatedCount} potentially outdated dependencies`, 'low');
        } else {
            this.audit.addResult('issue', `${outdatedCount} potentially outdated dependencies`, 'medium');
        }
    }
}

/**
 * Generate Subresource Integrity (SRI) hashes
 */
class SRIGenerator {
    constructor(audit) {
        this.audit = audit;
    }

    /**
     * Generate SRI hashes for local files
     */
    generateSRIHashes() {
        console.log('🔍 Generating SRI hashes...');

        const filesToHash = [
            'css/styles.min.css',
            'js/scripts.min.js'
        ];

        const sriHashes = {};

        filesToHash.forEach(file => {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file);
                const hash = crypto.createHash('sha384').update(content).digest('base64');
                sriHashes[file] = `sha384-${hash}`;
                this.audit.addResult('pass', `SRI hash generated for ${file}`, 'medium');
            }
        });

        // Write SRI hashes to file for reference
        if (Object.keys(sriHashes).length > 0) {
            fs.writeFileSync('sri-hashes.json', JSON.stringify(sriHashes, null, 2));
            console.log('📝 SRI hashes written to sri-hashes.json');
        }

        return sriHashes;
    }
}

/**
 * Main audit function
 */
async function runSecurityAudit() {
    console.log('🚀 Starting Wedding Website Security Audit...\n');

    const audit = new SecurityAudit();
    const fileScanner = new FileScanner(audit);
    const depScanner = new DependencyScanner(audit);
    const sriGenerator = new SRIGenerator(audit);

    try {
        // Scan files
        AUDIT_CONFIG.scanFiles.forEach(file => {
            fileScanner.scanFile(file);
        });

        // Scan dependencies
        depScanner.scanDependencies();

        // Generate SRI hashes
        sriGenerator.generateSRIHashes();

        // Additional security checks
        console.log('🔍 Running additional security checks...');

        // Check for .gitignore
        if (fs.existsSync('.gitignore')) {
            audit.addResult('pass', '.gitignore file exists', 'low');
        } else {
            audit.addResult('warning', '.gitignore file missing', 'low');
        }

        // Check for README
        if (fs.existsSync('README.md')) {
            audit.addResult('pass', 'Documentation (README.md) exists', 'low');
        }

        // Generate final report
        const passed = audit.generateReport();

        // Exit with appropriate code
        process.exit(passed ? 0 : 1);

    } catch (error) {
        console.error('❌ Security audit failed:', error.message);
        process.exit(1);
    }
}

// Run audit if called directly
if (require.main === module) {
    runSecurityAudit();
}

module.exports = {
    SecurityAudit,
    FileScanner,
    DependencyScanner,
    SRIGenerator,
    runSecurityAudit
};
