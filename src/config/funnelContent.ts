const cloudinaryBase = 'https://res.cloudinary.com/kyt3rjjz/image/upload'

export const funnelImages = {
  hero: `${cloudinaryBase}/f_auto,q_auto,w_1400/v1784259124/scarlett/quema-grasa-construye-musculo/img-2069-jpg.jpg`,
  story: `${cloudinaryBase}/f_auto,q_auto,w_1000/v1784259129/scarlett/quema-grasa-construye-musculo/img-2463-jpg.jpg`,
  learning: `${cloudinaryBase}/f_auto,q_auto,w_1000/v1784259126/scarlett/quema-grasa-construye-musculo/img-2100-jpg.jpg`,
  training: `${cloudinaryBase}/f_auto,q_auto,w_1100/v1784259224/scarlett/quema-grasa-construye-musculo/img-2501-jpg.jpg`,
  portrait: `${cloudinaryBase}/f_auto,q_auto,w_900/v1784259228/scarlett/quema-grasa-construye-musculo/img-9664-jpg.jpg`,
} as const

export const storyMilestones = [
  'A los 14 años pisé un gimnasio por primera vez queriendo cambiar mi cuerpo desesperadamente.',
  'Pasé mis 20s luchando con una relación tóxica con la comida y conmigo misma.',
  'Probé de todo: eliminar grupos de alimentos, pastillas y hasta pasar hambre real.',
] as const

export const learningItems = [
  { number: '01', title: 'Déficit sin drama', text: 'Entiende cómo funciona la pérdida de grasa sin pasar hambre ni dañar tu metabolismo.' },
  { number: '02', title: 'Tu fórmula de macros', text: 'Calcula proteína, carbohidratos y grasas según tu peso y nivel de actividad.' },
  { number: '03', title: 'Adiós ansiedad', text: 'Aprende a estructurar tus comidas para regular el hambre y mantenerte satisfecha.' },
  { number: '04', title: 'Recetas y Scar-Tips', text: 'Desayunos, almuerzos, cenas y meriendas con los alimentos que yo misma consumo.' },
  { number: '05', title: 'Suplementación inteligente', text: 'Proteína, creatina y magnesio explicados sin atajos inútiles ni gastos innecesarios.' },
  { number: '06', title: 'Entrenamiento completo', text: 'Rutinas de lunes a viernes con biseries y dropsets para conservar masa muscular.' },
] as const

export const macroTargets = [
  { label: 'Proteína', value: '1.6 a 2.2 g/kg', detail: 'Protege tu masa muscular.' },
  { label: 'Carbohidratos', value: '2 a 3 g/kg', detail: 'Tu fuente real de energía.' },
  { label: 'Grasas', value: '0.8 a 1 g/kg', detail: 'Hormonas y saciedad.' },
] as const

export const trainingDays = [
  { day: 'LUN', focus: 'Cuádriceps, abductores y glúteos' },
  { day: 'MAR', focus: 'Espalda y tríceps' },
  { day: 'MIÉ', focus: 'Glúteos, peso muerto y búlgaras' },
  { day: 'JUE', focus: 'Hombros y bíceps' },
  { day: 'VIE', focus: 'Cuádriceps y abductores' },
] as const

export const faqItems = [
  { question: '¿Tengo que eliminar los carbohidratos para ver resultados?', answer: '¡Para nada, bebé! Son tu fuente principal de energía. En el ebook aprenderás a incluirlos estratégicamente dentro de tu déficit para rendir al máximo.' },
  { question: '¿Comer de noche engorda?', answer: 'Mito absoluto. Lo que importa es el total de calorías del día. Puedes cenar dentro de tu déficit calórico con total tranquilidad.' },
  { question: '¿La balanza es el único indicador de éxito?', answer: 'No. Puedes perder grasa y construir músculo manteniendo un peso similar. Aprenderás a medir tu progreso con fotos, medidas y rendimiento.' },
  { question: '¿Es un producto físico?', answer: 'No. Es un producto 100% digital. En esta primera fase, tu compra queda registrada para conectarla con tu acceso al sitio de Scarlett Cordova.' },
] as const
