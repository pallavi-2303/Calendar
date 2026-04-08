export default function Hero() {
  return (
    <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden shadow-2xl mb-10">
      <img 
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80" 
        className="w-full h-full object-cover"
        alt="Mountain background"
      />
      <div className="absolute inset-0 bg-black/10 flex items-center px-12">
        <div className="bg-primary p-8 md:p-12 transform -rotate-3 shadow-2xl">
          <h1 className="text-white text-5xl md:text-7xl font-black leading-none">
            2024<br />JANUARY
          </h1>
        </div>
      </div>
    </div>
  );
}