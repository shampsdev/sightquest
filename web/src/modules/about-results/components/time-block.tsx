export const ResultBlock = () => {
  return (
    <div className="s bg-primary rounded-3xl w-full flex-col text-black">
      <p className="py-4 text-center text-2xl xs:text-3xl text-black">Время</p>

      <div className="bg-secondary-green  translate-y-1 h-32 xs:h-64 rounded-3xl w-full flex flex-col justify-center">
        <div>
          <p className="text-2xl xs:text-5xl text-center">24: 10</p>
          <p className="xs:pt-4 text-xl xs:text-3xl text-center">мин</p>
        </div>
      </div>
    </div>
  )
}
