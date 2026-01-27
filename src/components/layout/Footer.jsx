import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { useLanguage } from "../../contexts/LanguageContext";

export const Footer = () => {
  const { language } = useLanguage();

  const footerContent = {
    tr: {
      brandDesc:
        "Anadolu'nun Uyanan Tanrıçaları, kolektif hafızayı uyandıran ve iç yansımayı destekleyen bir alan.",
      explore: "Keşfet",
      citiesMap: "81 Şehir Haritası",
      readingLayers: "Okuma Katmanları",
      askSanri: "SANRI'ya Sor",
      aboutBook: "Kitap Hakkında",
      info: "Bilgi",
      allRights: "Tüm hakları saklıdır",
      disclaimer:
        "Bu uygulama bilgi vermez, anlam üretir; teşhis veya kesinlik sunmaz.",
    },
    en: {
      brandDesc:
        "Awakening Goddesses of Anatolia, a symbolic experience that awakens collective memory and supports inner reflection.",
      explore: "Explore",
      citiesMap: "81 Cities Map",
      readingLayers: "Reading Layers",
      askSanri: "Ask SANRI",
      aboutBook: "About the Book",
      info: "Info",
      allRights: "All rights reserved",
      disclaimer:
        "This application does not provide facts; it creates meaning and offers no diagnosis or certainty.",
    },
  };

  const fc = footerContent[language] || footerContent.tr;

  return (
    <footer className="bg-card/50 border-t">
      <div className="container mx-auto px-6 py-12">
        <p className="text-muted-foreground mb-4">{fc.brandDesc}</p>

        <div className="flex gap-4 text-sm">
          <Link to="/">{fc.explore}</Link>
          <Link to="/cities">{fc.citiesMap}</Link>
          <Link to="/reading">{fc.readingLayers}</Link>
          <Link to="/ask">{fc.askSanri}</Link>
        </div>

        <Separator className="my-6" />

        <p className="text-xs text-muted-foreground">
          {fc.allRights} • {fc.disclaimer}
        </p>
      </div>
    </footer>
  );
};