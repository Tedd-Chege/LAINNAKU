import React from 'react';
import { Card } from 'flowbite-react';

const PostCard = ({ post }) => {
  return (
    <Card key={post._id} className="shadow-2xl">
      <div className="p-2">
        <h3 className="text-2xl font-bold text-blue-600 mb-2">{post.title}</h3>
      
        <p className="text-base"><strong>Category:</strong> {post.category}</p>
        <p className="text-base"><strong>Form:</strong> {post.form}</p>
        <p className="text-base"><strong>Subject:</strong> {post.subject}</p>
        {post.category !== 'notes' && (
          <>
            <p className="text-base"><strong>Term:</strong> {post.term}</p>
            <p className="text-base"><strong>Year:</strong> {post.year}</p>
          </>
        )}
        <p className="text-base"><strong>Description:</strong> {post.description}</p>
        <p className="text-base"><strong>Upload Date:</strong> {new Date(post.uploadDate).toLocaleDateString()}</p>
        <a
          href={post.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-500 underline mt-2 block"
        >
          Download
        </a>
      </div>
    </Card>
  );
};

export default PostCard;
