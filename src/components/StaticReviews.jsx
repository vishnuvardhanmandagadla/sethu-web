import React from "react";
import "./StaticReviews.css";

const StaticReviews = () => {
  const reviews = [
    { 
      text: "The course was absolutely fantastic! The teacher explained every concept clearly, and the hands-on practice made it even better.", 
      author: "Aarav Sharma, GITE College" 
    },
    { 
      text: "I highly recommend this course to anyone looking to understand the fundamentals. The examples were relevant and practical.", 
      author: "Diya Patel, NIT Trichy" 
    },
    { 
      text: "One of the best courses I’ve taken! The instructor was very knowledgeable and the content was up-to-date with industry standards.", 
      author: "Shiva, Cambridge University" 
    },
    { 
      text: "The course helped me land my first job in the industry. It’s a must for anyone serious about learning.", 
      author: "Suresh, Nannaya University" 
    },
    { 
      text: "Fantastic course with great content! I learned a lot, and the projects were very practical.", 
      author: "Sathish, SRM University" 
    },
    { 
      text: "Clear explanations, and I loved how interactive the course was. The projects were challenging but fun!", 
      author: "Ishita Nair, VIT Vellore" 
    },
    { 
      text: "This course is a must for anyone wanting to get a comprehensive understanding of the subject. Truly an eye-opener!", 
      author: "Rahul Mehta, GITE University" 
    },
    { 
      text: "The instructor was very patient and explained things in a way that was easy to understand. I gained so much confidence.", 
      author: "Sneha Rao, GIET University" 
    },{ 
      text: "The course gave me a strong foundation to build my career. The faculty was extremely supportive throughout.", 
      author: "Vishnu, RIET College" 
    },
    { 
      text: "A very well-structured course with great examples and real-world projects. Highly recommended!", 
      author: "Durga Shankar, RIET College" 
    },
    { 
      text: "This course helped me gain confidence in my skills. The hands-on assignments were truly enlightening.", 
      author: "Lakshman, RIET College" 
    },
    { 
      text: "An excellent course for anyone who wants to learn and grow. The practical approach made it very engaging.", 
      author: "Rajesh, RIET College" 
    },    
  ];

  return (
    <section id="StaticReviews" className="w-full h-full">
      <div className="w-full reviews-container">
        <div className="lane lane-up">
          {reviews.concat(reviews).map((review, index) => (
            <div className="review-card" key={`up-${index}`}>
              <p>{`"${review.text}"`}</p>
              <p><strong>- {review.author}</strong></p>
            </div>
          ))}
        </div>
        <div className="lane lane-down">
          {reviews.concat(reviews).map((review, index) => (
            <div className="review-card" key={`down-${index}`}>
              <p>{`"${review.text}"`}</p>
              <p><strong>- {review.author}</strong></p>
            </div>
          ))}
        </div>
        <div className="lane lane-up">
          {reviews.concat(reviews).map((review, index) => (
            <div className="review-card" key={`up2-${index}`}>
              <p>{`"${review.text}"`}</p>
              <p><strong>- {review.author}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaticReviews;
