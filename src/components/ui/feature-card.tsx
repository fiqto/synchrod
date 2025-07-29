import Link from 'next/link';

interface FeatureCardProps {
  /** Icon emoji or React component to display */
  icon: string;
  /** Title of the feature */
  title: string;
  /** Description text explaining the feature */
  description: string;
  /** Optional href for navigation. If not provided, card won't be clickable */
  href?: string;
  /** Whether this feature is coming soon (shows badge and disables link) */
  comingSoon?: boolean;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  href, 
  comingSoon = false 
}: FeatureCardProps) {
  const CardContent = () => (
    <div className="relative bg-gradient-to-br from-secondary to-secondary-light border border-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl" role="img" aria-label={title}>
              {icon}
            </span>
          </div>
          {comingSoon && (
            <span className="bg-gradient-to-r from-accent/20 to-primary/20 text-accent border border-accent/30 text-xs px-3 py-1 rounded-full font-medium">
              Coming Soon
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-foreground-muted leading-relaxed mb-4">
          {description}
        </p>
        
        {!comingSoon && href && (
          <div className="flex items-center text-primary group-hover:text-accent transition-colors duration-300">
            <span className="text-sm font-medium mr-2">Learn more</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (comingSoon || !href) {
    return <CardContent />;
  }

  return (
    <Link href={href} className="block group">
      <CardContent />
    </Link>
  );
}