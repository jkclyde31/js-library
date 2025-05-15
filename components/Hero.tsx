
import { Button } from "./ui/button";

const Hero = async () => {

  

  return (
    <div className="flex flex-col justify-center items-center text-white h-[100%]">
        <h1 className="text-5xl font-bold mb-4 ">Discover. Borrow. Read.</h1>
        <p className="text-xl mb-8">Find what you need, book it online, and pick it up when it’s convenient.</p>
        <Button className="bg-main text-white px-6 py-[25px] rounded font-bold flex items-center justify-center hover:bg-opacity-80 hover:bg-hover">
            Browse Collection
        </Button>
    </div>
  );
};

export default Hero;
