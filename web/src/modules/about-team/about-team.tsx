import { PersonCard, PersonCardProps } from "./person-card";
import commandTitle from "@/assets/command.png";
import mike from "@/assets/command/mike.jpg";
import mitya from "@/assets/command/mitya.jpg";
import sanya from "@/assets/command/sanya.jpg";
import vanya from "@/assets/command/vanya.jpg";
import lilya from "@/assets/command/lilya.jpg";
import zenya from "@/assets/command/zenya.jpg";
import nastya from "@/assets/command/nastya.jpg";

const team: PersonCardProps[] = [
  {
    university: "НИУ ИТМО",
    amplua: "Фронтенд",
    name: "МИШЕЛЬ",
    surname: "де ДЖОФРОЙ",
    photo: mike,
    url: "https://t.me/mikedegeofroy",
  },
  {
    university: "НИУ ИТМО",
    amplua: "Фронтенд",
    name: "МИТЯ",
    surname: "МАМЧЕНКО",
    photo: mitya,
    url: "https://t.me/aliasmityai",
  },
  {
    university: "НИУ ИТМО",
    amplua: "Бэкенд",
    name: "САНЯ",
    surname: "ДЬЯКОНОВ",
    photo: sanya,
    url: "https://t.me/keine_salz",
  },
  {
    university: "НИУ ИТМО",
    amplua: "Бэкенд",
    name: "ВАНЯ",
    surname: "ТАРАСОВ",
    photo: vanya,
    url: "https://t.me/vaniog",
  },
  {
    university: "НИУ ВШЭ",
    amplua: "Дизайнер",
    name: "ЛИЛЯ",
    surname: "ЯФАРОВА",
    photo: lilya,
    url: "https://t.me/liliiyyaf",
  },
  {
    university: "SETU Carlow",
    amplua: "Фронтенд",
    name: "ЖЕНЯ",
    surname: "САЛЬНИКОВ",
    photo: zenya,
    url: "https://t.me/evsalik",
  },
  {
    university: "НИУ ИТМО",
    amplua: "Бизнес-Аналитик",
    name: "НАСТЯ",
    surname: "БОГДАНОВА",
    photo: nastya,
    url: "https://t.me/learn_how_to_use_a_cart",
  },
];

export const AboutTeam = () => {
  return (
    <section className="bg-secondary-bg py-8 px-5 -mx-2">
      <img src={commandTitle} />

      <div className="flex overflow-x-scroll snap-x snap-mandatory my-10 gap-5 -mx-5 no-scrollbar">
        {team.map((value, index) => (
          <div
            className="snap-center w-5/6 px-5"
            style={{ flex: "0 0 auto" }}
            key={index}
          >
            <PersonCard {...value} />
          </div>
        ))}
      </div>

      <div className="flex text-bg justify-between">
        <p className="max-w-[60%]">
          Команда, которая создала это приложение, состоит из равного количества
          фронтэнденров и бекэндеров, а также дизайнера. Вместе мы распределили
          задачи и старались выполнять их в срок.{" "}
        </p>
        <div className=" ">
          <p className="flex justify-between items-center text-sm">
            <span>Спб</span>
            <span>2024</span>
          </p>

          <span>ИТМО x НИУ ВШЭ</span>
        </div>
      </div>
    </section>
  );
};
