import Image from "next/image";

const reviews = [
  "/feedbacks/feedback1.png",
  "/feedbacks/feedback2.jpg",
  "/feedbacks/feedback3.png",
];

const Feedbacks = ({ title }: { title?: string }) => {
  return (
    <div className="w-full mt-10 md:mt-28">
      <h2 className="h2-bold text-center mb-16">
        <span className="text-primary">// </span>
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 sm:px-5">
        {reviews.map((review, index) => (
          <div key={index} className="relative aspect-square w-full">
            <Image
              src={review}
              alt={`Customer feedback ${index + 1}`}
              width={400}
              height={400}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
