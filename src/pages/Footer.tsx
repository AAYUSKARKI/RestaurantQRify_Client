import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="py-16 px-6 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <h3 className="font-display text-3xl tracking-[0.3em] text-foreground mb-6">
            AURELIA
          </h3>

          {/* Tagline */}
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            Where culinary artistry meets timeless elegance
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-12">
            {[
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Twitter, href: "#", label: "Twitter" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Decorative Line */}
          <div className="h-px w-32 bg-border mx-auto mb-8" />

          {/* Copyright */}
          <p className="font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} AURELIA. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
