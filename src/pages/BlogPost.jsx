import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiTag, FiShare2, FiMessageCircle } from 'react-icons/fi';
import { fetchBlogPost } from '../lib/supabase';

// Initial blog post data for fallback
const initialPostData = {
  id: 1,
  title: 'The Future of Cybersecurity: AI and Machine Learning',
  content: `
    <p>Artificial Intelligence (AI) and Machine Learning (ML) are transforming the cybersecurity landscape, offering powerful new tools to detect and respond to threats in real-time. As cyber threats become increasingly sophisticated, traditional security measures alone are no longer sufficient to protect organizations.</p>
    
    <h2>How AI is Revolutionizing Cybersecurity</h2>
    
    <p>AI systems can process and analyze vast amounts of data at speeds impossible for human analysts. This capability allows security teams to identify patterns, detect anomalies, and respond to threats faster than ever before.</p>
    
    <p>Key advantages of AI-powered security include:</p>
    
    <ul>
      <li>Real-time threat detection and response</li>
      <li>Automated security monitoring across complex environments</li>
      <li>Pattern recognition capabilities that improve over time</li>
      <li>Reduction in false positives that plague traditional security systems</li>
    </ul>
    
    <h2>Machine Learning for Predictive Security</h2>
    
    <p>Machine learning algorithms can be trained to recognize normal network behavior and flag deviations that might indicate a security breach. These systems continuously learn and adapt to new data, making them increasingly effective at identifying novel threats.</p>
    
    <p>Organizations implementing ML-based security solutions are seeing significant improvements in their security posture, including:</p>
    
    <ul>
      <li>Early detection of zero-day exploits</li>
      <li>Improved phishing and malware detection</li>
      <li>Enhanced user behavior analytics</li>
      <li>More effective vulnerability management</li>
    </ul>
    
    <h2>Challenges and Limitations</h2>
    
    <p>Despite their potential, AI and ML security solutions face several challenges:</p>
    
    <ul>
      <li>Adversarial attacks designed to fool AI systems</li>
      <li>The need for large, high-quality datasets for training</li>
      <li>The risk of over-reliance on automated systems</li>
      <li>Integration issues with existing security infrastructure</li>
    </ul>
    
    <h2>The Future Outlook</h2>
    
    <p>As AI and ML technologies continue to mature, we can expect to see more sophisticated applications in cybersecurity. Experts predict the emergence of autonomous security systems capable of not only detecting threats but also responding to and mitigating them without human intervention.</p>
    
    <p>Organizations that invest in AI-powered security solutions now will be better positioned to defend against the evolving threat landscape of tomorrow.</p>
  `,
  category: 'Emerging Technologies',
  author: 'John Smith',
  authorTitle: 'Chief Security Researcher',
  date: '2025-04-05',
  image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  readTime: '6 min read',
  tags: ['Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Threat Detection']
};

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      content: 'This article provides great insights into how AI is transforming security. Looking forward to seeing how these technologies evolve.',
      date: '2025-04-06',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 2,
      name: 'Michael Chen',
      content: 'I appreciate the balanced perspective on both the potential and limitations of AI in cybersecurity. Many articles overlook the challenges.',
      date: '2025-04-07',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ]);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        
        // Convert ID to number for comparison if needed
        const postId = parseInt(id);
        
        // Try to fetch from database
        const { data, error } = await fetchBlogPost(postId);
        
        if (error) throw error;
        
        if (data) {
          setPost(data);
        } else {
          // Fallback to initial data
          setPost(initialPostData);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
        // Fallback to initial data on error
        setPost(initialPostData);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      name: 'Guest User',
      content: comment,
      date: new Date().toISOString().split('T')[0],
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };

    setComments([...comments, newComment]);
    setComment('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-600 dark:border-dark-lighter dark:border-t-secondary-400 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-light-dark">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-light mb-4">Error</h2>
          <p className="text-gray-600 dark:text-light-darker">{error}</p>
          <Link to="/blog" className="mt-6 inline-block btn btn-primary">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-light mb-4">Post Not Found</h2>
          <p className="text-gray-600 dark:text-light-darker">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="mt-6 inline-block btn btn-primary">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-dark">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-light to-dark dark:from-dark dark:to-dark-lighter text-white py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.title}
            </motion.h1>

            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 text-light-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center">
                <FiUser className="mr-2" /> 
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" /> 
                <span>{new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" /> 
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center">
                <FiTag className="mr-2" /> 
                <span>{post.category}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden">
              {/* Featured Image */}
              <div className="h-96 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 md:p-10">
                <motion.div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-light prose-a:text-primary-600 dark:prose-a:text-secondary-400 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-light mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 dark:bg-dark text-gray-800 dark:text-light-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-light mb-4">Share this article</h3>
                  <div className="flex gap-3">
                    <button className="p-2 bg-[#3b5998] text-white rounded-full hover:bg-opacity-90 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 bg-[#1da1f2] text-white rounded-full hover:bg-opacity-90 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="p-2 bg-[#0077b5] text-white rounded-full hover:bg-opacity-90 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 bg-gray-700 dark:bg-dark text-white rounded-full hover:bg-opacity-90 transition-colors">
                      <FiShare2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Author Bio */}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-dark-light flex items-center justify-center">
                        <span className="text-gray-600 dark:text-light-darker font-bold">
                          {post.author.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-light">{post.author}</h3>
                      <p className="text-sm text-gray-600 dark:text-light-darker">{post.authorTitle || 'Security Expert'}</p>
                      <p className="mt-2 text-gray-600 dark:text-light-darker">
                        Cybersecurity professional with extensive experience in emerging security technologies and threat intelligence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-10 bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-light mb-6 flex items-center">
                  <FiMessageCircle className="mr-2" /> Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-10">
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-light-dark mb-2">
                      Leave a comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-dark-light dark:text-light shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 dark:focus:ring-secondary-400 focus:ring-opacity-50"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this article..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-secondary-600 dark:hover:bg-secondary-700 text-white rounded-md"
                  >
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                      <div className="flex items-start">
                        <div className="mr-4 flex-shrink-0">
                          <img
                            src={comment.avatar}
                            alt={comment.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-semibold text-gray-900 dark:text-light">{comment.name}</h4>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600 dark:text-light-darker">{comment.content}</p>
                          <button className="mt-2 text-sm text-primary-600 dark:text-secondary-400 hover:text-primary-700 dark:hover:text-secondary-500">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-gray-100 dark:bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-light mb-8 text-center">Related Articles</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: 2,
                title: 'Zero Trust Architecture: Implementation Best Practices',
                excerpt: 'A comprehensive guide to implementing Zero Trust security architecture in your organization.',
                category: 'Security Architecture',
                date: '2025-03-22',
                image: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                id: 3,
                title: 'Ransomware Attacks: Prevention and Recovery Strategies',
                excerpt: 'Learn how to protect your organization from ransomware and develop effective recovery plans.',
                category: 'Threat Protection',
                date: '2025-03-15',
                image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                id: 4,
                title: 'Cloud Security Challenges and Solutions',
                excerpt: 'Addressing the unique security challenges of cloud environments and strategies for mitigating risks.',
                category: 'Cloud Security',
                date: '2025-03-08',
                image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }
            ].map((article, index) => (
              <motion.div 
                key={article.id}
                className="bg-white dark:bg-dark-lighter rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Link to={`/blog/${article.id}`} className="block">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-dark text-primary-800 dark:text-secondary-400">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-light mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-secondary-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-light-darker line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;