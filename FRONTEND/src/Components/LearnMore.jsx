import React, { useState, useEffect } from "react";

const LearnMore = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate multiple leaves on page load
    const generateLeaves = () => {
      const totalLeaves = 60; // Increase the number of leaves
      const generatedLeaves = Array.from({ length: totalLeaves }).map(() => ({
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth, // Random horizontal position
        y: -Math.random() * 100, // Slightly varied starting Y positions
        delay: Math.random() * 4, // Add random delay for animation stagger
      }));
      setLeaves(generatedLeaves);

      // Clear leaves after animation ends
      setTimeout(() => setLeaves([]), 20000); // Adjusted for longer animation duration
    };

    generateLeaves();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgb(242, 242, 242)", // Light green background for a nature theme
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          //marginTop:'300px',
          //marginBottom:'200px',
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <h2>Our Commitment to Sustainability</h2>
        <p>
          At Eco-Conscious, we are dedicated to promoting a greener future by
          offering sustainable products and practices. Join us in making a
          positive impact on the planet.
        </p>
        <p>
          We believe in empowering our customers with eco-friendly choices and
          working towards a future where every purchase contributes to a
          healthier Earth. Thank you for being part of our journey.
        </p>
      </div>

      {/* Render leaves */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          style={{
            position: "absolute",
            width: `${20 + Math.random() * 20}px`, // Randomize leaf size
            height: `${20 + Math.random() * 20}px`,
            backgroundImage: "url('http://localhost:5173/src/Public/logo.png')", // Update this path
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            left: `${leaf.x}px`,
            top: `${leaf.y}px`,
            animation: `leafFall 6s cubic-bezier(0.5, 0.1, 0.5, 1) ${leaf.delay}s forwards`,
          }}
        ></div>
      ))}

      {/* Keyframes for natural leaf fluttering */}
      <style>
        {`
          @keyframes leafFall {
            0% {
              transform: translateY(0) rotate(0deg) scale(1);
              opacity: 1;
            }
            20% {
              transform: translateX(-30px) translateY(100px) rotate(-20deg) scale(1.1);
            }
            40% {
              transform: translateX(40px) translateY(200px) rotate(15deg) scale(1);
            }
            60% {
              transform: translateX(-20px) translateY(300px) rotate(-10deg) scale(0.9);
            }
            80% {
              transform: translateX(10px) translateY(400px) rotate(10deg) scale(0.8);
            }
            100% {
              transform: translateX(0) translateY(600px) rotate(360deg) scale(0.7);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LearnMore;



// import React, { useState } from "react";

// const LearnMore = () => {
//   const [leaves, setLeaves] = useState([]);

//   const handleClick = (e) => {
//     const newLeaf = {
//       id: Date.now(),
//       x: e.clientX,
//       y: e.clientY,
//     };
//     setLeaves((prevLeaves) => [...prevLeaves, newLeaf]);

//     // Remove the leaf after the animation ends
//     setTimeout(() => {
//       setLeaves((prevLeaves) => prevLeaves.filter((leaf) => leaf.id !== newLeaf.id));
//     }, 5000); // Matches animation duration
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         backgroundColor: "#e8f5e9", // Light green background for a nature theme
//         position: "relative",
//         overflow: "hidden",
//       }}
//       onClick={handleClick}
//     >
//       <div
//         style={{
//           backgroundColor: "#fff",
//           padding: "20px",
//           borderRadius: "10px",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           maxWidth: "600px",
//           textAlign: "center",
//         }}
//       >
//         <h2>Our Commitment to Sustainability</h2>
//         <p>
//           At Eco-Conscious, we are dedicated to promoting a greener future by
//           offering sustainable products and practices. Join us in making a
//           positive impact on the planet.
//         </p>
//         <p>
//           We believe in empowering our customers with eco-friendly choices and
//           working towards a future where every purchase contributes to a
//           healthier Earth. Thank you for being part of our journey.
//         </p>
//       </div>

//       {/* Render green leaves */}
//       {leaves.map((leaf) => (
//         <div
//           key={leaf.id}
//           style={{
//             position: "absolute",
//             width: "30px",
//             height: "30px",
//             backgroundImage: "url('http://localhost:5173/src/Public/logo.png')", // Update this path
//             backgroundSize: "contain",
//             backgroundRepeat: "no-repeat",
//             left: `${leaf.x - 15}px`, // Center the leaf on the click
//             top: `${leaf.y - 15}px`,
//             animation: "leafFall 5s cubic-bezier(0.5, 0.1, 0.5, 1) forwards",
//           }}
//         ></div>
//       ))}

//       {/* Keyframes for the natural leaf fluttering motion */}
//       <style>
//         {`
//           @keyframes leafFall {
//             0% {
//               transform: translateY(0) rotate(0deg) scale(1);
//               opacity: 1;
//             }
//             25% {
//               transform: translateX(-30px) translateY(100px) rotate(-30deg) scale(1.1);
//             }
//             50% {
//               transform: translateX(30px) translateY(200px) rotate(30deg) scale(1);
//             }
//             75% {
//               transform: translateX(-20px) translateY(300px) rotate(-20deg) scale(0.9);
//             }
//             100% {
//               transform: translateX(0) translateY(500px) rotate(360deg) scale(0.8);
//               opacity: 0;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default LearnMore;
