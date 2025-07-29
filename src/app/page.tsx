import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { FeatureCard } from '@/components/ui/feature-card';

export default function Home() {
  return (
    <PageContainer>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary py-24 px-4 sm:px-6 lg:px-8">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-secondary-light border border-border rounded-full text-sm text-foreground-muted mb-8 animate-fade-in">
                <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse-soft"></span>
                New tools launching soon
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
                JSON workflows made
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  effortless
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-foreground-muted mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
                Merge, customize, and convert JSON data with powerful online tools built for developers who value speed and precision.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
                <Link
                  href="/json-merge"
                  className="group bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 flex items-center gap-2"
                >
                  Start for free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="group border-2 border-border hover:border-primary text-foreground hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-primary/5 flex items-center gap-2"
                >
                  See how it works
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-16 text-sm text-foreground-muted animate-fade-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No registration required
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Privacy focused
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Always free
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/2 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  About Synchrod
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 leading-tight">
                Built for developers who value
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  speed and precision
                </span>
              </h2>
              <p className="text-xl text-foreground-muted leading-relaxed max-w-4xl mx-auto mb-12">
                Synchrod is your comprehensive online toolset for JSON data manipulation. Whether you need to merge multiple JSON files, 
                customize field values, or transform complex data structures, our tools help developers handle JSON workflows faster, 
                cleaner, and smarter than ever before.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
                  <p className="text-foreground-muted">Process large JSON files instantly with optimized algorithms</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
                  <p className="text-foreground-muted">All processing happens locally in your browser</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Developer Friendly</h3>
                  <p className="text-foreground-muted">Intuitive interface designed by developers for developers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Tools Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Our Tools
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Powerful JSON utilities
                <br />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  at your fingertips
                </span>
              </h2>
              <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
                Comprehensive tools designed to handle all your JSON processing needs with precision and ease.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon="🔁"
                title="Merge JSON"
                description="Combine multiple JSON files with matching structures. Perfect for configuration merging and data consolidation."
                href="/json-merge"
              />
              
              <FeatureCard
                icon="🔄"
                title="Replace Fields"
                description="Replace specific fields in JSON entries using reference data with ID matching. Perfect for data transformation workflows."
                href="/json-replacer"
              />
              
              <FeatureCard
                icon="🧩"
                title="More Tools Coming Soon"
                description="JSON Validator, Data Cleaner, Formatter, Schema Generator, and many more tools are in development!"
                comingSoon={true}
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                How It Works
              </h2>
              <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
                Transform your JSON data in three simple steps. No complex setup, no learning curve.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="group relative">
                {/* Connection line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-8 z-0"></div>
                
                <div className="relative bg-gradient-to-br from-secondary to-secondary-light border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 text-center">Upload Your Files</h3>
                  <p className="text-foreground-muted text-center leading-relaxed">
                    Drag and drop or select your JSON files. All processing happens locally in your browser for maximum security and privacy.
                  </p>
                </div>
              </div>
              
              <div className="group relative">
                {/* Connection line */}
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent/30 to-transparent -translate-x-8 z-0"></div>
                
                <div className="relative bg-gradient-to-br from-secondary to-secondary-light border border-border rounded-2xl p-8 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 text-center">Configure Options</h3>
                  <p className="text-foreground-muted text-center leading-relaxed">
                    Set up field mapping, merge strategies, or transformation rules using our intuitive and powerful interface.
                  </p>
                </div>
              </div>
              
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-secondary to-secondary-light border border-border rounded-2xl p-8 hover:border-success/30 transition-all duration-500 hover:shadow-xl hover:shadow-success/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-success rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 text-center">Download Result</h3>
                  <p className="text-foreground-muted text-center leading-relaxed">
                    Get your processed JSON file instantly. Clean, formatted, and ready to use in your projects with complete data integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <span className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
                Ready to get started?
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              Streamline your JSON
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                workflow today
              </span>
            </h2>
            
            <p className="text-xl text-foreground-muted mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who trust Synchrod for their JSON processing needs. 
              Fast, reliable, secure, and completely free to use.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/json-merge"
                className="group bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 flex items-center gap-3"
              >
                Start processing JSON
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/#about"
                className="group border-2 border-border hover:border-primary text-foreground hover:text-primary px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-primary/5 flex items-center gap-3"
              >
                Learn more about Synchrod
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-12 mt-16 text-sm text-foreground-muted">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 border border-success/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 border border-success/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Always free</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 border border-success/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Data stays local</span>
              </div>
            </div>
          </div>
        </section>
    </PageContainer>
  );
}

