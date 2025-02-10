import { useState, useEffect, useRef, useMemo, useCallback } from "react";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const [input, setInput] = useState("");
  const [task, setTask] = useState<string[]>([]);

  const [edit, setEdit] = useState({
    enable: false,
    task: "",
  });

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoreact");

    if (tarefasSalvas) {
      setTask(JSON.parse(tarefasSalvas));
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("@cursoreact", JSON.stringify(task));
  }, [task]);

  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha o nome da sua tarefa");
      return;
    }
    if (edit.enable) {
      handleSaveEdit();
      return;
    }

    setTask((tarefa) => [...tarefa, input]);
    setInput("");
  }, [input, task]);

  const handleSaveEdit = () => {
    const findIndexTask = task.findIndex((task) => task === edit.task);
    const allTask = [...task];
    allTask[findIndexTask] = input;
    setTask(allTask);
    console.log(allTask);
    console.log(setTask);

    setEdit({
      enable: false,
      task: "",
    });
    setInput("");
  };

  const handleDelete = (item: string) => {
    const removeTask = task.filter((task) => task !== item);
    setTask(removeTask);
  };

  const handleEdit = (item: string) => {
    inputRef.current?.focus();
    setInput(item);
    setEdit({
      enable: true,
      task: item,
    });
  };

  const totalTarefas = useMemo(() => {
    return task.length;
  }, [task]);

  return (
    <div>
      <h1>Lista de tarefas</h1>
      <input
        placeholder="Digite o nome da tarefa..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        ref={inputRef}
      />
      <button onClick={handleRegister}>
        {edit.enable ? "Atualizar tarefa" : "Adicionar tarefa"}
      </button>
      <hr />
      <strong>Você tem {totalTarefas} tarefas!</strong>
      <br />
      <br />
      {task.map((item) => (
        <section key={item}>
          <span>{item}</span>
          <button onClick={() => handleEdit(item)}>Editar</button>
          <button onClick={() => handleDelete(item)}>Excluir</button>
        </section>
      ))}
    </div>
  );
}

export default App;
