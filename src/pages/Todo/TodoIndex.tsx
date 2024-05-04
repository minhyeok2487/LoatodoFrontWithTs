import DefaultLayout from "../../layouts/DefaultLayout";
import '../../styles/pages/TodoIndex.css';
import TodoProfit from "./Components/TodoProfit";

const TodoIndex = () => {
  return (
    <DefaultLayout>
      {/* 일일 수익, 주간수익 */}
      <TodoProfit />
    </DefaultLayout>
  );
};

export default TodoIndex;
