import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            AlphaEye
          </Link>
          
          <nav className="flex space-x-6">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/tokens" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Tokens
            </Link>
            <Link 
              href="/dashboard/analysis" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Analysis
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
