import TestDataNotify from "../../components/TestDataNotify";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../styles/pages/TodoIndex.css";
import TodoProfit from "./components/TodoProfit";
import TodoServerAndChallenge from "./components/TodoServerAndChallenge";

const TodoIndex = () => {
  return (
    <DefaultLayout>
      <TestDataNotify />

      {/* 일일 수익, 주간수익 */}
      <TodoProfit />

      {/*도비스/도가토 버튼*/}
      <TodoServerAndChallenge />
    </DefaultLayout>
  );
};

export default TodoIndex;
