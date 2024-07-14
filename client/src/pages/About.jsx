import { useSelector } from 'react-redux';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-bold text-center my-7'>
            About LAINNAKU
          </h1>
          <div className='text-black'>
            <p className='mb-4'>
              Welcome to LAINNAKU! This platform was created to provide a comprehensive collection of educational resources, exams, notes, and marking schemes. Our mission is to facilitate learning and academic excellence by providing easily accessible materials for students and educators.
            </p>

            <p className='mb-4'>
              On this platform, you'll find regularly updated content on various subjects and educational levels. Our resources include exam papers, marking schemes, notes, and results from different schools. We aim to support both students in their studies and teachers in their instructional efforts.
            </p>

            <p className='mb-4'>
              We encourage you to interact with our content by leaving comments and engaging with other users. Your feedback helps us improve and ensure that our materials are beneficial to the community. Let's work together to create a supportive and effective learning environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
