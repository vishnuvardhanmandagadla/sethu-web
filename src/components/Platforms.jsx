import React, { useState } from "react";
import "./Platforms.css";

const Platforms = () => {
  const [platformData, setPlatformData] = useState([
    {
      name: "codechef",
      image: "https://yt3.googleusercontent.com/Lkx3tvgHdRADC3wXQ5TfJZRTeH4nboEPA_-eJChOZ6jRkOdY35lcg014Whj36rHFXhrHY1T_4cs=s900-c-k-c0x00ffffff-no-rj",
      description: "codechef",
      amount: "$199",
    },
    {
      name: "hacker earth",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/HackerEarth_logo.png",
      description: "hacker earth.",
      amount: "$299",
    },
    {
      name: "leet code",
      image: "https://avatars.githubusercontent.com/u/41718343?s=280&v=4",
      description: "leet code.",
      amount: "$399",
    },
    {
      name: "gfg",
      image: "https://yt3.googleusercontent.com/2Vh4NlpOdxCECWi6cP2vBugq2WMwad37pj26OopOV_12LF43KoEgPPBcry8MAdESz6Iqy5bkzYU=s900-c-k-c0x00ffffff-no-rj",
      description: "gfg",
      amount: "$499",
    },

      {
        name: "hacker rank",
        image: "https://amit839.github.io/resources/css/images/achievements/hackerrank-logo.jpg",
        description: "hacker rank.",
        amount: "$399",
      },
      // minimum 6 cards details need
    
  ]);

  return (
    <section className="platforms">
      <h2 className="text-4xl font-bold mb-6 text-center">Platforms</h2>
      <p className="text-lg text-center max-w-2xl mx-auto mb-12">
        Discover our platforms designed to enhance learning, creativity, and innovation.
      </p>

      <div className="scrolling-cards">
        <div className="cards-slide">
          {platformData.map((platform, index) => (
            <div key={index} className="platform-card">
              <img src={platform.image} alt={platform.name} />
              <div className="card-content">
                <h3 className="text-lg font-bold">{platform.name}</h3>
                <p>{platform.description}</p>
                <span className="amount">{platform.amount}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="cards-slide">
          {/* Duplicate cards for seamless scrolling */}
          {platformData.map((platform, index) => (
            <div key={`duplicate-${index}`} className="platform-card">
              <img src={platform.image} alt={platform.name} />
              <div className="card-content">
                <h3 className="text-lg font-bold">{platform.name}</h3>
                <p>{platform.description}</p>
                <span className="amount">{platform.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platforms;
