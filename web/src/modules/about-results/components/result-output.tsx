import clockIcon from '@/assets/clock_icon.svg'

export const ResultOutput = () => {
  return (
    <div className="flex justify-between items-center bg-secondary-green rounded-full h-16 xs:h-24 w-full">
      <div className="rounded-full bg-primary w-16 xs:w-24 h-full">
        <img className='-translate-y-[2px] p-3 h-full' src={clockIcon}/>
      </div>
      <span className="pr-4 text-black text-2xl xs:text-5xl xs:pr-[20%]">18</span>
    </div>
  )
}
