import React from 'react';
import Image from 'next/image';
import Button from './Button';

interface DateIdea {
  title: string;
  description: string;
  imageUrl?: string;
}

interface DateIdeaCardProps {
  idea: DateIdea;
}

const DateIdeaCard: React.FC<DateIdeaCardProps> = ({ idea }) => {
  const displayImageUrl = idea.imageUrl || '/mochi.png'; // TODO: Change this to a placeholder image in /public

  const handleReadMore = () => {
    // TODO: Implement action for "Read more" (e.g., show modal, navigate)
    console.log("Read more clicked for:", idea.title);
  };

  return (
    <div className="card w-80 md:w-96 bg-white shadow-xl rounded-lg overflow-hidden border border-base-300">
      {/* Image Section */}
      <figure className="relative h-48 w-full">
        <Image
          src={displayImageUrl}
          alt={idea.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </figure>

      {/* Content Section */}
      <div className="card-body items-center text-center p-4">
        <h2 className="card-title font-bold text-lg mb-1 text-background">{idea.title}</h2>
        <p className="text-sm opacity-80 mb-4 text-background">{idea.description}</p>
        <div className="card-actions justify-center">
            <Button text="Read more" onClick={handleReadMore} />
        </div>
      </div>
    </div>
  );
};

export default DateIdeaCard;