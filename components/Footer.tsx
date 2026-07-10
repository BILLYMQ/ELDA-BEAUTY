import Image from "next/image";
import Link from "next/link";

const QUICK_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/nouveautes", label: "Nouveautés" },
  { href: "/videos", label: "Vidéos" },
  { href: "/panier-reservation", label: "Panier & Réservation" },
  { href: "/messagerie", label: "Messagerie" },
];

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-elda-gold/20 bg-elda-black text-elda-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ELDA BEAUTY"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="font-display text-lg font-bold tracking-wide">
              ELDA <span className="text-elda-gold">BEAUTY</span>
            </span>
          </div>
          <p className="max-w-xs font-body text-sm leading-relaxed text-elda-cream/70">
            Une maison de parfumerie qui célèbre l&apos;élégance et l&apos;éclat naturel.
            Révélez votre personnalité à travers nos fragrances d&apos;exception.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-elda-gold">
            Liens rapides
          </h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-elda-cream/70 transition-colors hover:text-elda-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-elda-gold">
            Contact
          </h3>
          <ul className="space-y-2.5 font-body text-sm text-elda-cream/70">
            <li>Abidjan, Côte d&apos;Ivoire</li>
            <li>+225 07 00 00 00 00</li>
            <li>contact@eldabeauty.com</li>
            <li>Lun - Sam : 9h - 19h</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-elda-gold">
            Suivez-nous
          </h3>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-elda-gold/30 px-4 py-2 font-body text-xs font-medium text-elda-cream/80 transition-colors hover:border-elda-gold hover:text-elda-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-elda-gold/10 py-5">
        <p className="text-center font-body text-xs text-elda-cream/50">
          © {new Date().getFullYear()} ELDA BEAUTY. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
