import React, { useEffect, useState } from 'react'
import Modal from './Modal';
import Comment from './Comment';
import { BiCommentDetail } from "react-icons/bi";
import { gorestApi } from '@/lib/api';

type BlogType = {
  id: number;
  user_id: number;
  title: string;
  body: string;
}[];

type CommentProps = {
  id: number;
  name: string;
  email: string;
  body: string;
}[]

const Post = () => {
  const [blogPost, setBlogPost] = useState<BlogType | null>(null);
  const [comments, setComments] = useState<CommentProps>([]);

  const [showComments, setShowComments] = useState<boolean>(false);

  const fetchBlogPost = async () => {
    try {
      const res = await gorestApi.get('/posts');
      setBlogPost(res.data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  const fetchComments = async (id: number) => {
    try {
      const res = await gorestApi.get(`/posts/${id}/comments`);
      setComments(res.data);
      setShowComments(true);
    } catch (error) {
      console.error(`Failed to fetch comments for post ${id}:`, error);
    }
  };

  useEffect(() => {
    fetchBlogPost();
  }, []);

  return (
    <div className='py-10'>
      <h1 className="text-4xl font-bold text-slate-700 mb-8">Blog Post</h1>
      {
        blogPost?.map(({ id, user_id, title, body }, index) => (
          <div key={id} className="rounded-xl p-8 border border-slate-300 bg-white mb-8">
            <div className="grid lg:grid-cols-[1fr,1fr] gap-4">
              <span className={`${index % 2 === 0 ? "bg-red-400" : "bg-blue-400"} text-white p-3 rounded-lg text-xl flex items-center justify-center`}>{user_id}</span>
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-1">{title}</h2>
                <p className="text-slate-500">{body}</p>
                <div className="mt-4">
                  <button onClick={() => fetchComments(id)} className="text-slate-500 text-sm hover:text-blue-500">
                    <BiCommentDetail className="w-6 h-6 inline-block mr-2" />Comments
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      }
      <Modal visible={showComments} onClose={() => setShowComments(false)} allowClickOutside={true}>
        <div className="mx-auto mb-4">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">Comments</h2>
          <div>
            {comments.length > 0 ? (
              comments.map(({ id, name, body }, index) => (
                <div key={id}>
                  <Comment {...{ id, name, body }} />
                  {comments.length - 1 !== index && <hr className="border-t-solid border-1 border-grey my-6" />}
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8 italic">No comments available.</p>
            )}
          </div>

        </div>
        <hr className="border-t-solid border-1 border-grey mt-6" />
        <div className="flex flex-row justify-end">
          <button
            className="mt-4 border border-neutral-300 rounded-lg py-2 px-10 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setShowComments(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Post