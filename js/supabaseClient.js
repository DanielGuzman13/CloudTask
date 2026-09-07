/**
 * Configuración de conexión a Supabase.
 *
 * IMPORTANTE — reemplaza estos dos valores con los de TU proyecto:
 *   1. Ve al dashboard de Supabase → tu proyecto → Project Settings → API.
 *   2. Copia "Project URL" y pégalo en SUPABASE_URL.
 *   3. Copia la clave "anon public" (NO la "service_role") y pégala en SUPABASE_ANON_KEY.
 *
 * La anon key es pública por diseño: está pensada para usarse directamente
 * en código de navegador. Lo que protege tus datos es Row Level Security (RLS),
 * no mantener esta clave en secreto. Por eso SÍ puedes subir este archivo a GitHub.
 *
 * La "service_role key" es distinta: esa SÍ es secreta, se salta RLS por completo
 * y jamás debe usarse en código de frontend ni subirse a un repositorio.
 */

const SUPABASE_URL = "https://pnulgpladurcmnomtluq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudWxncGxhZHVyY21ub210bHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NDIzMDksImV4cCI6MjEwNDMxODMwOX0.JMxIsfo2q3WpML10lnW843h9sRe4d3MS8my9-ULQuOg";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
