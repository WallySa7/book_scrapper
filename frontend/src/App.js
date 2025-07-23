import React, { useState } from "react";
import {
  Search,
  Book,
  DollarSign,
  Package,
  Globe,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const BookSearchApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWebsites, setSelectedWebsites] = useState([]);

  // Arabic bookstore websites
  const bookstores = [
    { name: "الكتبيين", url: "https://alkutubiyeen.net", id: "alkutubiyeen" },
    { name: "المحدث", url: "https://almohadith.com/ar", id: "almohadith" },
    { name: "رشد", url: "https://rushd.sa/", id: "rushd" },
    { name: "ابن الجوزي", url: "https://ibnaljawzi.com/", id: "ibnaljawzi" },
    { name: "الجامعة", url: "https://aljameah.com", id: "aljameah" },
    { name: "دار تيباء", url: "https://dartaybaa.com/", id: "dartaybaa" },
    { name: "دار أمجد", url: "https://daramjad.com/", id: "daramjad" },
    {
      name: "ورقون",
      url: "https://wrraqoon.com/index.php?route=common/home",
      id: "wrraqoon",
    },
    {
      name: "دار الحضارة",
      url: "https://daralhadarah.net",
      id: "daralhadarah",
    },
    { name: "خير جليس", url: "https://kheerjalees.com/", id: "kheerjalees" },
    { name: "دار أطلس", url: "https://daratlas.sa/", id: "daratlas" },
    { name: "كتاب كلبابك", url: "https://ketabklbabk.com/", id: "ketabklbabk" },
    { name: "دار الزمان", url: "https://www.daralzaman.sa", id: "daralzaman" },
    {
      name: "نيل وفرات",
      url: "https://www.neelwafurat.com/",
      id: "neelwafurat",
    },
    { name: "الحجاز", url: "https://alhijaz2020.com/", id: "alhijaz" },
    { name: "سوتور", url: "https://suotuor.com/ar", id: "suotuor" },
    {
      name: "هايبر بوكس",
      url: "https://hyperbooks-online.com/",
      id: "hyperbooks",
    },
    { name: "دار زدني", url: "https://darzidnie.com/ar", id: "darzidnie" },
    { name: "الإكليل", url: "https://alekleel.com/", id: "alekleel" },
    { name: "أسفار", url: "https://asfar.io/", id: "asfar" },
    { name: "كنوز", url: "https://konoozb.net/", id: "konoozb" },
    { name: "الخبير", url: "https://salla.sa/alkhabeer9", id: "alkhabeer" },
    { name: "طيبة ستور", url: "https://tayba-store.com/", id: "tayba" },
    { name: "جرير", url: "https://www.jarir.com", id: "jarir" },
    {
      name: "أرفف الكتب",
      url: "https://bookshelvess.com/ar/",
      id: "bookshelves",
    },
    { name: "عقيدة", url: "https://anaqeed.sa", id: "anaqeed" },
    { name: "روعان", url: "https://roouckan.com", id: "roouckan" },
    { name: "مؤسسة", url: "https://mo42ksa.com/", id: "mo42ksa" },
    { name: "كتب", url: "https://elmbooks.net/", id: "elmbooks" },
    { name: "ستور", url: "https://sto1or.com/", id: "sto1or" },
    { name: "نوادر مزيد", url: "https://nawadermzed.com/", id: "nawadermzed" },
    { name: "المأثور", url: "https://almathur.com/", id: "almathur" },
    { name: "أثريب", url: "https://aithrib.com/", id: "aithrib" },
    { name: "ضياء القاري", url: "https://diaalqari.com/", id: "diaalqari" },
    { name: "رشم ستور", url: "https://rashm-store.com/", id: "rashm" },
    { name: "مهاوير", url: "https://muhawir2020.com/", id: "muhawir" },
    {
      name: "روائع الكتاب",
      url: "https://rwaeaelketab.com/",
      id: "rwaeaelketab",
    },
    { name: "فاست أوردر", url: "https://fastorder.store/", id: "fastorder" },
    { name: "كلل الكتب", url: "https://kolelkutub.com/", id: "kolelkutub" },
    {
      name: "صيد الكتب",
      url: "https://www.saydelkutub.com/",
      id: "saydelkutub",
    },
  ];

  const toggleWebsite = (websiteId) => {
    setSelectedWebsites((prev) =>
      prev.includes(websiteId)
        ? prev.filter((id) => id !== websiteId)
        : [...prev, websiteId]
    );
  };

  const selectAll = () => {
    setSelectedWebsites(bookstores.map((store) => store.id));
  };

  const selectNone = () => {
    setSelectedWebsites([]);
  };

  // Backend API configuration
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://your-backend-url.com"
      : "http://localhost:3001";

  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      alert("يرجى إدخال اسم الكتاب أو المؤلف");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      // Prepare website filter
      const websitesParam =
        selectedWebsites.length > 0
          ? `?websites=${selectedWebsites.join(",")}`
          : "";

      // Make API call to backend
      const response = await fetch(
        `${API_BASE_URL}/api/search/${encodeURIComponent(
          searchQuery
        )}${websitesParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results) {
        setResults(data.results);

        // Show cache status
        if (data.cached) {
          console.log("📋 Results loaded from cache");
        } else {
          console.log("🔍 Fresh search completed");
        }

        const successfulResults = data.results.filter(
          (r) => r.success && r.books.length > 0
        );
        if (successfulResults.length === 0) {
          alert("لم يتم العثور على نتائج. جرب كلمات بحث مختلفة.");
        }
      }
    } catch (error) {
      console.error("خطأ في البحث:", error);
      alert(`حدث خطأ أثناء البحث: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4'
      dir='rtl'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <Book className='w-10 h-10 text-amber-600' />
            <h1 className='text-4xl font-bold text-gray-800'>
              باحث الكتب العربية
            </h1>
          </div>
          <p className='text-gray-600 text-lg'>
            قارن أسعار الكتب عبر أفضل المكتبات العربية
          </p>
        </div>

        {/* Backend Status */}
        <div className='bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg mb-6 flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 mt-0.5 flex-shrink-0' />
          <div>
            <p className='font-semibold mb-2'>حالة الخادم الخلفي:</p>
            <p className='text-sm leading-relaxed'>
              تطبيق مكتمل مع خادم Node.js لاستخراج البيانات من المكتبات العربية.
              تأكد من تشغيل الخادم الخلفي على المنفذ 3001 قبل البحث.
            </p>
            <div className='text-sm mt-2'>
              <span className='font-medium'>رابط الخادم:</span> {API_BASE_URL}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className='bg-white rounded-2xl shadow-xl p-6 mb-8'>
          <div className='flex gap-4 mb-6'>
            <div className='flex-1 relative'>
              <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='ابحث عن كتاب أو مؤلف...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg'
                dir='rtl'
              />
            </div>
            <button
              onClick={searchBooks}
              disabled={loading}
              className='px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium'>
              {loading ? "جاري البحث..." : "بحث"}
              <Search className='w-5 h-5' />
            </button>
          </div>

          {/* Website Selection */}
          <div className='border-t pt-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2'>
                <Globe className='w-5 h-5' />
                اختر المكتبات للبحث فيها ({selectedWebsites.length}/
                {bookstores.length})
              </h3>
              <div className='flex gap-2'>
                <button
                  onClick={selectAll}
                  className='px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200'>
                  تحديد الكل
                </button>
                <button
                  onClick={selectNone}
                  className='px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200'>
                  إلغاء التحديد
                </button>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-60 overflow-y-auto'>
              {bookstores.map((store) => (
                <label
                  key={store.id}
                  className='flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50'>
                  <input
                    type='checkbox'
                    checked={selectedWebsites.includes(store.id)}
                    onChange={() => toggleWebsite(store.id)}
                    className='w-4 h-4 text-amber-600 rounded'
                  />
                  <span className='text-sm truncate' title={store.name}>
                    {store.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
              نتائج البحث
            </h2>

            {results.map((result, index) => (
              <div
                key={index}
                className='bg-white rounded-xl shadow-lg overflow-hidden'>
                {/* Bookstore Header */}
                <div
                  className={`px-6 py-4 border-r-4 ${
                    result.success
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <Globe
                        className={`w-5 h-5 ${
                          result.success ? "text-green-600" : "text-red-600"
                        }`}
                      />
                      <h3 className='text-lg font-semibold'>
                        {result.bookstore}
                      </h3>
                      {result.books && (
                        <span className='text-sm text-gray-500'>
                          ({result.books.length} كتاب)
                        </span>
                      )}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {new Date(result.scrapedAt).toLocaleTimeString("ar-SA")}
                    </div>
                  </div>

                  {!result.success && (
                    <p className='text-red-600 text-sm mt-2'>
                      خطأ: {result.error || "فشل في الاتصال بالموقع"}
                    </p>
                  )}
                </div>

                {/* Books List */}
                {result.success && result.books && result.books.length > 0 && (
                  <div className='p-6 space-y-4'>
                    {result.books.map((book, bookIndex) => (
                      <div
                        key={bookIndex}
                        className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'>
                        <div className='grid md:grid-cols-3 gap-4'>
                          {/* Book Image */}
                          {book.image && (
                            <div className='md:col-span-1'>
                              <img
                                src={book.image}
                                alt={book.title}
                                className='w-full h-48 object-cover rounded-lg'
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                            </div>
                          )}

                          {/* Book Details */}
                          <div
                            className={
                              book.image ? "md:col-span-2" : "md:col-span-3"
                            }>
                            <h4 className='text-lg font-semibold text-gray-800 mb-2'>
                              {book.title}
                            </h4>

                            {book.author && (
                              <p className='text-gray-600 mb-2'>
                                <strong>المؤلف:</strong> {book.author}
                              </p>
                            )}

                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center gap-2'>
                                <DollarSign className='w-5 h-5 text-green-600' />
                                <span className='text-xl font-bold text-green-600'>
                                  {book.price}
                                </span>
                              </div>

                              <div className='flex items-center gap-2'>
                                <Package
                                  className={`w-5 h-5 ${
                                    book.inStock
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                />
                                <span
                                  className={`font-medium ${
                                    book.inStock
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}>
                                  {book.inStock ? "متوفر" : "غير متوفر"}
                                </span>
                              </div>
                            </div>

                            {book.url && (
                              <a
                                href={book.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors'>
                                <ExternalLink className='w-4 h-4' />
                                عرض الكتاب في {result.bookstore}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No books found */}
                {result.success &&
                  result.books &&
                  result.books.length === 0 && (
                    <div className='p-6 text-center text-gray-500'>
                      لم يتم العثور على كتب في {result.bookstore}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Setup Instructions */}
        <div className='mt-12 bg-green-50 rounded-xl p-6'>
          <h3 className='text-xl font-bold text-green-800 mb-4'>
            تعليمات تشغيل التطبيق:
          </h3>
          <div className='grid md:grid-cols-2 gap-6 text-sm'>
            <div>
              <h4 className='font-semibold text-green-700 mb-2'>
                1. تشغيل الخادم الخلفي:
              </h4>
              <div className='bg-black text-green-400 p-3 rounded font-mono text-xs'>
                cd backend
                <br />
                npm install
                <br />
                npm start
              </div>
            </div>
            <div>
              <h4 className='font-semibold text-green-700 mb-2'>
                2. تشغيل التطبيق:
              </h4>
              <div className='bg-black text-green-400 p-3 rounded font-mono text-xs'>
                cd frontend
                <br />
                npm install
                <br />
                npm start
              </div>
            </div>
            <div>
              <h4 className='font-semibold text-green-700 mb-2'>
                3. المتطلبات:
              </h4>
              <ul className='space-y-1'>
                <li>• Node.js 18+</li>
                <li>• Chrome/Chromium للـ Puppeteer</li>
                <li>• ذاكرة RAM كافية (2GB+)</li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold text-green-700 mb-2'>4. النشر:</h4>
              <ul className='space-y-1'>
                <li>• Railway أو Render للخادم</li>
                <li>• Vercel أو Netlify للواجهة</li>
                <li>• DigitalOcean للخوادم المخصصة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearchApp;
