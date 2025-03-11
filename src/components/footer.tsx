export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-bold text-indigo-600">Tempo</span>
            <p className="text-sm text-gray-600 mt-1">
              © {new Date().getFullYear()} Tempo. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/form"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
