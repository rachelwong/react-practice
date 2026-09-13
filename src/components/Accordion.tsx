const Accordion = () => {
  return (
    <div className="accordion-container block relative w-full mb-4">
      <Button
        variant="outline"
        size="lg"
        className="w-full py-2 px-4 flex flex-row align-center justify-between"
      >
        <p className="text-left">{item.title}</p>
        <ChevronUp />
      </Button>
      <Card className="mt-1 px-4 py-2">
        <p>{item.content}</p>
      </Card>
    </div>
  );
};

export default Accordion;
