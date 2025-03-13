import plus from "@/assets/plus.svg"
import decor2 from "@/assets/decor-2.svg"
import decor3 from "@/assets/decor-3.svg"
import topArrow from "@/assets/project-arrow.svg"
import { Title } from "@/components/ui/title"

export const AppSection = () => {
  return (
    <section>
      <Title>
        Приложение
      </Title>

      <p className="text-secondary">
        Которое точно решит вашу<br/> 
        проблему, если вам скучно<br/>
        и вы не знаете как провести время
      </p>

      <div className="py-16 relative">
        <p className="absolute right-0 top-0 xs:-top-2 text-primary xs:text-lg">
          Исследовать<br/>
          город одному
        </p>
        <img className="top-12 right-20 xs:right-32 xs:w-12 absolute" src={topArrow}/>

        <div className="grid grid-cols-2 grid-rows-3 gap-4">
          <div 
            className="row-span-2 col-start-2 row-start-1 bg-[#555555] rounded-3xl overflow-hidden"
          >
            <img
              className="h-full w-full object-cover"
              src={decor3}
            />
          </div>
          <div className="col-start-2 row-start-3 bg-primary rounded-3xl flex items-center">
            <p className="xs:text-3xl px-4">
              Ввести код
            </p>
          </div>
          <div className="row-span-3 col-start-1 relative row-start-1 bg-[#555555] rounded-3xl overflow-hidden">
            <img
              className="absolute top-4 left-4"
              src={plus}
            />

            <img
              className="w-full h-full object-cover"
              src={decor2}
            />

            <p className="absolute bottom-4 left-4 xs:text-3xl text-primary">
              Играть<br/>
              с друзьями
            </p>
          </div>

          <p className="absolute left-0 -bottom-4 text-primary xs:text-lg">
            Сыграть в догонялки<br/>
            с друзьями
          </p>
          <img className="bottom-8 left-[30%] xs:w-12 absolute rotate-180" src={topArrow}/>
        </div>
      </div>
    </section>
  )
}
