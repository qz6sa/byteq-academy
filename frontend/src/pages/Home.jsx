import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Categories from '../components/home/Categories';
import FeaturedCourses from '../components/home/FeaturedCourses';

const Home = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedCourses />
    </div>
  );
};

export default Home;
