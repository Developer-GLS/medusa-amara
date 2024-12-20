import Hero from "./hero";
import Paragraph from "./paragraph";
import Cta from "./cta";
// Importa altri componenti se necessari

const componentMapping: Record<string, React.FC<any>> = {
  hero: Hero,
  paragraph: Paragraph,
  cta: Cta
  // Aggiungi altri componenti qui
};

export default componentMapping;
