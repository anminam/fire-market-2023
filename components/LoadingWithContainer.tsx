function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full w-full mt-10">
      {children}
    </div>
  );
}

export default function LoadingWithContainer() {
  return (
    <CenterContainer>
      <div className="loading loading-spinner loading-lg"></div>
    </CenterContainer>
  );
}
