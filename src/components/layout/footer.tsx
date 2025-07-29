export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-foreground">Synchrod</h3>
              <p className="text-foreground-muted mt-2 max-w-md">
                Powerful JSON processing tools built for developers who value speed, precision, and privacy.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              <li>
                <a href="/json-merge" className="text-foreground-muted hover:text-primary transition-colors text-sm">
                  JSON Merge
                </a>
              </li>
              <li>
                <a href="/json-replacer" className="text-foreground-muted hover:text-primary transition-colors text-sm">
                  JSON Replacer
                </a>
              </li>
              <li>
                <span className="text-foreground-muted text-sm opacity-50">
                  JSON Validator (Soon)
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#about" className="text-foreground-muted hover:text-primary transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-foreground-muted hover:text-primary transition-colors text-sm">
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="text-foreground-muted hover:text-primary transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-foreground-muted mb-4 md:mb-0">
              © {currentYear} Synchrod. All rights reserved. More tools coming soon.
            </p>
            <div className="flex items-center gap-4 text-xs text-foreground-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                Privacy First
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Always Free
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}