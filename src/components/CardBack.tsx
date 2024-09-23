import clsx from "clsx";
import { gsap } from "gsap";
import { useEffect } from "react";
import { useRef } from "react";

interface ICardBackProps {
  className?: string;
  index: number
}

const CardBack = ({ className, index }: ICardBackProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          {
            y: 500,
            x: -100,
            rotateZ: 180,
          },
          {
            x: index * 30,
            y: 0,
            rotateZ: 0,
            duration: 1,
            ease: "elastic.out(0.5, 0.5)",
          }
        );
      }
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={ref}
      className={clsx(
        className,
        `rounded-md w-24 h-32 border-2 border-slate-500 bg-slate-800 flex items-center justify-center`
      )}
    >
      <p className="text-7xl text-white ">?</p>
    </div>
  );
};

export default CardBack;
