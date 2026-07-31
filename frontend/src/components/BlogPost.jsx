import { useState, useEffect } from 'react';
import axios from 'axios';
import learnIcon   from '../assets/g12.png';
import blogIcon    from '../assets/Vector.png';
import focusIcon   from '../assets/Group 2740.png';
import doctorIcon  from '../assets/Vector (1).png';
import parentsIcon from '../assets/Shape.png';
import infographicImg from '../assets/image 1.png';

const API_URL = 'https://qa7.parentune.com/api/blog/blogs/v4/blog?itemId=11144';
const HEADERS = {
  'accept': 'application/json',
  'accept-language': 'en-US,en;q=0.9',
  'lang': 'en',
  'guestuid': '8903d41a83f5a70e92a27f62755631f8',
};


const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const BlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(API_URL, { headers: HEADERS });
        if (response.data && response.data.data) {
          setBlog(response.data.data);
        } else if (response.data && response.data.title) {
          setBlog(response.data);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        if (err.response) {
          setError(`Error ${err.response.status}: Server Error`);
        } else if (err.request) {
          setError('Network Error: Could not reach the server.');
        } else {
          setError(err.message || 'Something went wrong.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, []);

  if (isLoading) return <BlogSkeleton />;
  if (error) return <BlogError message={error} />;
  if (!blog) return null;


  const title       = blog.title || '';
  const content     = blog.description || '';
  const excerpt     = blog.summary || '';
  const coverImage  = blog.thumbNail || blog.thumb || '';
  const authorName  = blog.bloggerName || 'Unknown Author';
  const authorAvatar= blog.bloggerAvatar || '';
  const qualification = blog.bloggerQualification || '';
  const publishedAt = formatDate(blog.pDate);
  const updatedAt   = blog.mDate ? formatDate(blog.mDate) : null;
  const category    = blog.primaryAgeGroup || '';
  const views       = blog.viewsCount || '';
  const timeAgo     = blog.time || '';

  
  const hasReviewer = blog.reviewedBy && Object.keys(blog.reviewedBy).length > 0;
  const reviewerName   = hasReviewer ? blog.reviewedBy.name          : 'Janaradhan Reddy';
  const reviewerAvatar = hasReviewer ? blog.reviewedBy.avatar        : blog.bloggerAvatar;
  const reviewerQual   = hasReviewer ? blog.reviewedBy.qualification : 'Paediatrician MBBS';

 
  const tags = Array.isArray(blog.mappedInterests) && blog.mappedInterests.length > 0
    ? blog.mappedInterests
    : [];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-24">

    
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold ml-2 text-gray-800">Blogs and Vlogs</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5">

       
        <div className="text-[13px] text-gray-500 font-medium mb-3">
          Home &gt; Blog &gt; Blog Name
        </div>

     
        <h2 className="text-[22px] sm:text-2xl font-bold leading-snug text-gray-800 mb-3">
          {title}
        </h2>

        
        {excerpt && (
          <div
            className="text-base text-gray-600 leading-relaxed mb-0"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        )}

        
        <div className="flex justify-between items-center text-[17px] text-gray-500 mb-5">
          <span>Age Group: {category}</span>
          <span>{views} views</span>
        </div>

        
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1 no-scrollbar">
          
          <div className="flex items-center gap-3.5 border-[1.5px] border-[#e2e4e7] rounded-full py-2.5 pl-2.5 pr-5 bg-white shrink-0">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
              />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-[15px] text-[#2d3748] leading-snug">
                Author: {authorName}
              </span>
              {qualification && (
                <span className="text-[13px] text-gray-400 mt-0.5">
                  {qualification}
                </span>
              )}
            </div>
          </div>

         
          <div className="flex items-center gap-3.5 border-[1.5px] border-[#e2e4e7] rounded-full py-2.5 pl-2.5 pr-5 bg-white shrink-0">
            {reviewerAvatar && (
              <img
                src={reviewerAvatar}
                alt={reviewerName}
                className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
              />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-[15px] text-[#2d3748] leading-snug">
                Reviewed By: {reviewerName}
              </span>
              {reviewerQual && (
                <span className="text-[13px] text-gray-400 mt-0.5">
                  {reviewerQual}
                </span>
              )}
            </div>
          </div>
        </div>

        
        {coverImage && (
          <div className="w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </div>
        )}

      
        <div className="flex justify-between items-center text-[13px] text-gray-400 font-medium mb-6 px-1">
          <span>Published: {publishedAt}{timeAgo ? ` (${timeAgo})` : ''}</span>
          {updatedAt && <span>Updated: {updatedAt}</span>}
        </div>

        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-[12px] font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-0.5"
              >
                #{typeof tag === 'object' ? tag.name || tag.title : tag}
              </span>
            ))}
          </div>
        )}

        
        {(() => {
          const splitIndex = content.search(/<p[^>]*>(?:(?!<\/p>).)*handwritten note/i);
          if (splitIndex !== -1) {
            const part1 = content.slice(0, splitIndex);
            const part2 = content.slice(splitIndex);
            return (
              <>
                <article
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: part1 }}
                />
                <InThisArticle items={blog.inthisArticle} />
                <article
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: part2 }}
                />
              </>
            );
          }
          return (
            <>
              <InThisArticle items={blog.inthisArticle} />
              <article
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </>
          );
        })()}

        <DoctorQA />

        <FAQSection faqs={blog.faqs} quickFact={blog.quickFact} />

       
        <div className="mt-7 mb-5">
          <h3 className="text-[17px] font-bold text-[#1A2B35] mb-3 leading-snug">
            What Are The Chances Of Having A Recurring Molar Pregnancy?
          </h3>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
            If you have had a molar pregnancy earlier, there is a 1% chance of the next one being a molar pregnancy. It means that 99 out of 100 women will have a normal pregnancy. However, if you have had more than one molar pregnancy earlier, then the risk in the next pregnancy increases to about 15-20% (10). If it repeats, it will be of the same histologic type. Therefore, consult your doctor for tailored care and guidance for your future pregnancies.
          </p>
          {coverImage && (
            <div className="w-full aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm">
              <img
                src={coverImage}
                alt="Recurring Molar Pregnancy"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        
        <div className="mt-7 mb-5">
          <h3 className="text-[17px] font-bold text-[#1A2B35] mb-3 leading-snug">
            Infographic: What Are The Symptoms Of Molar Pregnancy?
          </h3>
          <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
            A molar pregnancy is a rare condition where the woman experiences fluid-filled cells in the uterus due to conception. It can lead to severe complications if left untreated. The infographic below presents symptoms of molar pregnancy to look for to get early intervention.
          </p>
          <div className="w-full rounded-xl overflow-hidden mt-4 mb-3 shadow-sm">
            <img
              src={infographicImg}
              alt="Infographic: Possible Signs And Symptoms Of Molar Pregnancy"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        
        <FAQAccordion />

        
        <ReferencesSection references={blog.references} />

       
        <ContributorProfileCard blog={blog} />

      </main>

      <BottomNav active="Blog" />
    </div>
  );
};


const ContributorProfileCard = ({ blog }) => {
  const [activeTab, setActiveTab] = useState('Reviewer');


  const authorData = {
    role: 'Author',
    name: blog?.bloggerName || 'Zahira',
    avatar: blog?.bloggerAvatar || 'https://img1.parentune.com/images/avatar/Untitled design (3)14071720102156.png',
    qualification: blog?.bloggerQualification || 'MSc',
    bio: blog?.bloggerBio || 'Shreeja holds a postgraduate degree in Chemistry and diploma in Drug Regulatory Affairs from the University of Mumbai. Before joining MomJunction, she worked as a research analyst with a leading multinational pharmaceutical company.',
  };

  
  const reviewerData = {
    role: 'Reviewer',
    name: blog?.reviewedBy?.name || 'Zahira',
    avatar: blog?.reviewedBy?.avatar || blog?.bloggerAvatar || 'https://img1.parentune.com/images/avatar/Untitled design (3)14071720102156.png',
    qualification: blog?.reviewedBy?.qualification || 'MSc',
    bio: blog?.reviewedBy?.bio || 'Shreeja holds a postgraduate degree in Chemistry and diploma in Drug Regulatory Affairs from the University of Mumbai. Before joining MomJunction, she worked as a research analyst with a leading multinational pharmaceutical company.',
  };

  
  const editorData = {
    role: 'Editor',
    name: blog?.editorName || 'Dr. Nida Asif',
    avatar: 'https://img1.parentune.com/images/avatar/Untitled design (3)14071720102156.png',
    qualification: 'Pediatrician MBBS',
    bio: 'Medical editor and consultant for child health and developmental care, reviewing evidence-based medical articles.',
  };

 
  const factCheckerData = {
    role: 'Fact Checker',
    name: blog?.factCheckerName || 'Janaradhan Reddy',
    avatar: 'https://img1.parentune.com/images/avatar/Untitled design (3)14071720102156.png',
    qualification: 'Senior Clinical Researcher',
    bio: 'Verifies clinical facts and accuracy across maternal and pediatric healthcare content.',
  };

  const profileMap = {
    Reviewer: reviewerData,
    Author: authorData,
    Editor: editorData,
    'Fact Checker': factCheckerData,
  };

  const current = profileMap[activeTab] || reviewerData;
  const tabs = ['Reviewer', 'Author', 'Editor', 'Fact Checker'];

  return (
    <div className="bg-[#FFF5F2] rounded-[24px] p-6 my-8 font-sans">
    
      <div className="bg-white rounded-full p-1 border border-gray-100/80 flex items-center justify-between mb-6 shadow-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2.5 px-3 rounded-full text-[14px] font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#36848A] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 bg-transparent'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

     
      <div className="flex items-start gap-3.5 mb-4">
        {current.avatar && (
          <img
            src={current.avatar}
            alt={current.name}
            className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-200"
          />
        )}
        <div className="flex flex-col pt-0.5">
          <h4 className="text-lg font-bold text-gray-900 leading-snug">
            {current.name}
          </h4>
          {current.qualification && (
            <span className="text-sm text-gray-500 font-normal">
              {current.qualification}
            </span>
          )}
        </div>
      </div>

    
      <p className="text-[15px] text-gray-700 leading-relaxed mb-5 font-normal">
        {current.bio}
      </p>

      
      <div>
        <h5 className="font-bold text-sm text-gray-900 mb-2.5">
          Connect with me
        </h5>
        <div className="flex items-center gap-2.5">
         
          <a href="#" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

         
          <a href="#" className="w-8 h-8 rounded-lg bg-[#3b5998] flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
            </svg>
          </a>

         
          <a href="#" className="w-8 h-8 rounded-lg bg-[#0077b5] flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};


const FALLBACK_REFERENCES = [
  { text: 'Molar pregnancy;', source: 'Healthdirect' },
  { text: 'Molar pregnancy;', source: 'Miscarriage association' },
  { text: 'Partial Molar Pregnancy;', source: 'Cleveland Clinic' },
  { text: 'Molar pregnancy;', source: 'Betterhealth' },
  { text: 'Symptoms & diagnosis;', source: 'Miscarriage Association' },
  { text: 'Signs and Symptoms of Gestational Trophoblastic Disease;', source: 'American Cancer Society, Inc' },
  { text: 'Molar pregnancy;', source: 'March of Dimes' },
  { text: 'Types of treatment for molar pregnancy;', source: 'Cancer Research UK' },
];

const ReferencesSection = ({ references }) => {
  const list = Array.isArray(references) && references.length > 0 ? references : FALLBACK_REFERENCES;

  return (
    <div className="mt-8 mb-6 pt-6 border-t border-gray-100 font-sans">
      <h3 className="text-xl font-bold text-[#1A2B35] mb-3">
        References
      </h3>
      <p className="text-[14px] italic text-gray-600 leading-relaxed mb-5">
        Parentune’s articles are written after analyzing the research works of expert authors and institutions. Our references consist of resources established by authorities in their respective fields. You can learn more about the authenticity of the information we present in our{' '}
        <span className="underline cursor-pointer text-teal-700 not-italic font-medium">
          editorial policy
        </span>.
      </p>

      <ol className="list-decimal pl-5 space-y-2 text-[14px] text-gray-700 italic">
        {list.map((item, index) => {
          const title = item.text || item.title || item.name || '';
          const source = item.source || item.publisher || '';
          return (
            <li key={index} className="pl-1 leading-relaxed">
              <span className="text-[#00897B] underline cursor-pointer hover:opacity-80">
                {title}
              </span>{' '}
              <span className="not-italic text-gray-800 font-normal">
                {source}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};


const FAQ_ACCORDION_DATA = [
  {
    question: 'Is a partial molar pregnancy considered a miscarriage?',
    answer: 'A partial molar pregnancy is often considered a miscarriage or threatened miscarriage because the fetus develops abnormally and can’t survive for more than three months in a partial molar pregnancy',
  },
  {
    question: 'Is a partial molar pregnancy considered a miscarriage?',
    answer: 'A partial molar pregnancy is often considered a miscarriage or threatened miscarriage because the fetus develops abnormally and can’t survive for more than three months in a partial molar pregnancy',
  },
  {
    question: 'Is a partial molar pregnancy considered a miscarriage?',
    answer: 'A partial molar pregnancy is often considered a miscarriage or threatened miscarriage because the fetus develops abnormally and can’t survive for more than three months in a partial molar pregnancy',
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(1);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 rounded-[20px] p-6 my-7 border border-gray-100/60">
      <h3 className="text-center text-xl font-bold text-gray-700 mt-0 mb-5">
        Frequently Asked Questions
      </h3>

      <div className="flex flex-col gap-3.5">
        {FAQ_ACCORDION_DATA.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 transition-all duration-200">
              <div
                onClick={() => toggle(index)}
                className="flex justify-between items-center cursor-pointer gap-3"
              >
                <span className="text-[15px] font-semibold text-gray-800 leading-snug">
                  {item.question}
                </span>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-base transition-all duration-200 ${
                  isOpen ? 'bg-[#00897B] text-white' : 'bg-[#E0F2F1] text-[#00897B]'
                }`}>
                  {isOpen ? '−' : '+'}
                </div>
              </div>

              {isOpen && (
                <p className="mt-3 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3 mb-0">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


const FALLBACK_IN_ARTICLE = [
  { title: 'Key Pointers' },
  { title: 'What Is A Molar Pregnancy?' },
  { title: 'What Are The Risk Factors For Molar Pregnancy?' },
  { title: 'How Is Molar Pregnancy Diagnosed?' },
  { title: 'How Is Molar Pregnancy Treated?' },
];

const InThisArticle = ({ items }) => {
  const list = Array.isArray(items) && items.length > 0 ? items : FALLBACK_IN_ARTICLE;

  return (
    <div className="in-article-box p-5 sm:p-6 rounded-2xl my-6 border-l-4 border-[#F16A21] bg-[#FFF9F6]">
      <h3 className="text-2xl font-bold text-[#1A2B35] mb-4 mt-0">
        In This Article
      </h3>
      <div className="flex flex-col gap-3">
        {list.map((item, index) => {
          const itemTitle = typeof item === 'string' ? item : (item.title || item.name || '');
          return (
            <div key={index} className="flex items-baseline gap-2.5 text-[15px] font-medium text-[#00897B] cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-sm text-[#00897B]">↓</span>
              <span className="underline underline-offset-4">
                {itemTitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const NAV_ITEMS = [
  { label: 'Learn',   icon: learnIcon   },
  { label: 'Blog',    icon: blogIcon    },
  { label: 'Focus',   icon: focusIcon   },
  { label: 'Doctors', icon: doctorIcon  },
  { label: 'Parents', icon: parentsIcon },
];

const BottomNav = ({ active }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5 z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
    {NAV_ITEMS.map(({ label, icon }) => {
      const isActive = label === active;
      return (
        <button key={label} className="flex flex-col items-center gap-1 bg-transparent border-0 cursor-pointer px-2">
          <img
            src={icon}
            alt={label}
            className={`w-6 h-6 object-contain ${
              isActive
                ? 'brightness-90 sepia saturate-[12] hue-rotate-[330deg]'
                : 'opacity-60'
            }`}
          />
          <span className={`text-[11px] ${isActive ? 'font-semibold text-red-600' : 'font-normal text-gray-400'}`}>
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);


const QA_CARDS = [
  {
    user: { name: 'Maira Shaikh', category: 'Pregnancy', avatar: 'https://img1.parentune.com/images/avatar/Untitled design (3)14071720102156.png' },
    question: 'Can pregnant moms take the pertussis vaccine to protect their baby?',
    doctor: { name: 'Dr. Nida Asif', specialty: 'Pediatrician', avatar: 'https://img1.parentune.com/images/avatar/Untitled design (3)14071720102156.png', verified: true },
    answer: 'Hi Maira Shaikh, Yes, the current recommended vaccination is ...',
  }
];

const DoctorQA = () => {
  const [active, setActive] = useState(0);
  const card = QA_CARDS[active];

  return (
    <div className="mt-8 mb-4 border-[1.5px] border-dashed border-[#5BC4E0] rounded-2xl bg-[#FFF8EF] p-4">
     
      <h3 className="font-bold text-base text-[#1a2b35] mb-3 leading-snug">
        Doctor Q&amp;As from Parents like you
      </h3>

   
      <div className="qa-card p-4 bg-white rounded-xl shadow-sm">

       
        <div className="flex items-center gap-2.5 mb-3">
          <img
            src={card.user.avatar}
            alt={card.user.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div>
            <div className="font-semibold text-sm text-[#1a2b35]">{card.user.name}</div>
            <div className="text-xs text-gray-500">{card.user.category}</div>
          </div>
        </div>

       
        <p className="text-sm text-[#1a2b35] leading-normal mb-3.5 m-0">
          {card.question}
        </p>

      
        <hr className="border-0 border-t border-dashed border-gray-300 my-3" />

       
        <span className="inline-block text-[11px] text-gray-500 font-medium border border-gray-300 rounded-full px-2.5 py-0.5 mb-2.5">
          Answered By
        </span>


        <div className="flex items-center gap-2.5 mb-2.5">
          <img
            src={card.doctor.avatar}
            alt={card.doctor.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div>
            <div className="flex items-center gap-1 font-semibold text-sm text-[#1a2b35]">
              {card.doctor.name}
              {card.doctor.verified && (
                <svg className="w-3.5 h-3.5 text-[#00897B]" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#00897B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="12" cy="12" r="10" fill="#00897B" opacity="0.15"/>
                  <path d="M9 12l2 2 4-4" stroke="#00897B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="text-xs text-gray-500">{card.doctor.specialty}</div>
          </div>
        </div>

        {/* Answer preview */}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed m-0">
          {card.answer}{' '}
          <span className="text-[#00897B] font-semibold cursor-pointer hover:underline">read more</span>
        </p>
      </div>

     
      <div className="flex justify-center gap-1.5 my-3.5">
        {QA_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full border-0 p-0 cursor-pointer transition-all duration-200 ${
              i === active ? 'w-2.5 h-2.5 bg-[#00897B]' : 'w-2 h-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

     
      <button className="block w-full bg-[#1f4b5e] hover:bg-[#163545] text-white font-bold text-sm tracking-wider border-0 rounded-full py-3.5 cursor-pointer transition-colors duration-200 uppercase">
        ASK NOW
      </button>
    </div>
  );
};


const FALLBACK_FAQS = [
  {
    question: 'Can you prevent Meningococcal meningitis?',
    answer: 'Fortunately, yes, some forms of bacterial and viral meningitis are preventable through vaccination. Meningococcal meningitis is one of those vaccine preventable bacterial meningitis.',
  },
  {
    question: 'Can you prevent Meningococcal meningitis?',
    answer: 'As we celebrate World Meningitis Day this month, let me take some time and tell you a personal story and why you should take this name seriously. About five years ago, when I had just got married and not even planning for a child, an untimely death occurred in my husband\'s family. All that I remember now that it was due to meningitis and happened within 24 hours.',
  },
];

const FAQSection = ({ faqs, quickFact }) => {
  const items = Array.isArray(faqs) && faqs.length > 0 ? faqs : FALLBACK_FAQS;

  return (
    <div className="mt-6">
      {items.map((item, i) => (
        <div key={i}>
          {/* Question */}
          <h3 className={`font-bold text-[15px] text-[#1a2b35] mb-2.5 ${i === 0 ? 'mt-0' : 'mt-6'}`}>
            {item.question}
          </h3>
          
          <p className="text-[15px] text-gray-700 leading-relaxed mb-2">
            {item.answer}
          </p>
          
          {i === 0 && <QuickFact fact={quickFact} />}
        </div>
      ))}
    </div>
  );
};


const QuickFact = ({ fact }) => {
  const text = fact ||
    'Fortunately, yes, some forms of bacterial and viral meningitis are preventable through vaccination.';

  return (
    <div className="flex items-center my-7 relative w-full font-sans">
      <div className="flex items-center relative w-full">
        
      
        <div className="relative w-[150px] h-[130px] shrink-0 z-20 flex items-center">
          
         
          <div className="absolute top-0 left-3 z-40 -rotate-12">
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C7.611 0 0 7.611 0 17C0 22.186 2.502 26.837 6.333 29.8V33C6.333 34.657 7.676 36 9.333 36H24.667C26.324 36 27.667 34.657 27.667 33V29.8C31.498 26.837 34 22.186 34 17C34 7.611 26.389 0 17 0Z" fill="#F4C744"/>
              <path d="M9.333 37.5H24.667V39.5C24.667 40.881 23.548 42 22.167 42H11.833C10.452 42 9.333 40.881 9.333 39.5V37.5Z" fill="#6B7280"/>
              <path d="M10.5 35.5H23.5V37.5H10.5V35.5Z" fill="#9CA3AF"/>
              <path d="M12 20C13.5 20 14 21.5 14 23V27M22 20C20.5 20 20 21.5 20 23V27M14 27H20" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>

         
          <svg
            width="150"
            height="110"
            viewBox="0 0 150 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible absolute top-[10px]"
          >
           
            <path
              d="M 28 48 L 108 14 C 120 9 128 17 123 29 L 93 93 C 88 104 73 106 63 96 L 16 66 C 6 56 13 43 28 48 Z"
              fill="#FFFCF5"
              stroke="#FBE5CD"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Front Triangle */}
            <path
              d="M 32 23 L 126 49 C 135 52 135 61 126 64 L 32 90 C 22 93 15 84 17 72 L 22 41 C 24 29 23 21 32 23 Z"
              fill="#FFFFFF"
              stroke="#FAD09E"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>

         
          <div className="absolute left-[30px] top-[40px] flex flex-col justify-center items-center z-30 pointer-events-none">
            <span className="text-[24px] font-black text-[#F48B29] leading-none tracking-[0.01em]">
              QUICK
            </span>
            <span className="text-[24px] font-black text-[#F48B29] leading-none tracking-[0.01em]">
              FACT
            </span>
          </div>
        </div>

        {/* Rectangle on Right */}
        <div className="flex-1 -ml-[45px] pl-[55px] pr-6 py-6 bg-[#FFFCF7] border-2 border-dashed border-[#FAD09E] rounded-2xl min-h-[90px] flex items-center z-10">
          <p className="m-0 text-[17px] text-slate-700 leading-[1.6] font-normal">
            {text}
          </p>
        </div>
        
      </div>
    </div>
  );
};

// ── Loading Skeleton ──────────────────────────────────────────────
const BlogSkeleton = () => (
  <div className="min-h-screen bg-white font-sans">
    <header className="flex items-center px-4 py-4 border-b border-gray-100">
      <span className="skeleton w-6 h-6 rounded-full" />
      <span className="skeleton h-5 w-32 ml-4" />
    </header>
    <main className="max-w-3xl mx-auto px-4 pt-5">
      <span className="skeleton h-3 w-48 mb-4 block" />
      <span className="skeleton h-7 w-full mb-2 block" />
      <span className="skeleton h-7 w-3/4 mb-5 block" />
      <span className="skeleton h-4 w-full mb-2 block" />
      <span className="skeleton h-4 w-5/6 mb-6 block" />
      <div className="flex gap-3 mb-6">
        <span className="skeleton w-40 h-12 rounded-full block" />
        <span className="skeleton w-48 h-12 rounded-full block" />
      </div>
      <span className="skeleton w-full block aspect-[4/3] rounded-xl mb-3" />
      <div className="flex justify-between mb-8">
        <span className="skeleton h-3 w-28 block" />
        <span className="skeleton h-3 w-28 block" />
      </div>
      <span className="skeleton h-4 w-full mb-2 block" />
      <span className="skeleton h-4 w-full mb-2 block" />
      <span className="skeleton h-4 w-4/5 mb-2 block" />
    </main>
  </div>
);


const BlogError = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center max-w-sm">
      <div className="text-red-500 mb-3">
        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load content</h3>
      <p className="text-sm text-gray-500 mb-5">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

export default BlogPost;
