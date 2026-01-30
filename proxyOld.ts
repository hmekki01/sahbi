// proxy.ts
import { NextResponse, type NextRequest } from 'next/server';

const SUPPORTED = ['ar', 'fr', 'en'];
const DEFAULT = 'ar';

export function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const [, maybeLocale] = url.pathname.split('/');

  if (!maybeLocale) {
    // Aucun segment → redirige / -> /ar
    url.pathname = `/${DEFAULT}${url.pathname}`;
    return NextResponse.redirect(url);
  }

  if (!SUPPORTED.includes(maybeLocale)) {
    // Locale inconnue → remplace par défaut
    url.pathname = `/${DEFAULT}${url.pathname.slice(maybeLocale.length + 1)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
