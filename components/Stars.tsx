import Spaceship from "../islands/Spaceship.tsx";

function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

function Star() {
  return (
    <div
      class="star"
      style={`--star-left: ${getRandomNumber(100)}%; --star-time: ${
        getRandomNumber(1000) + 500
      }ms`}
    ></div>
  );
}

export function Stars() {
  return (
    <div id="stars">
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Star />
      <Spaceship />
    </div>
  );
}
