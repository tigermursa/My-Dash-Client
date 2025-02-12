import GenericEditor from "../components/GenericEditor/GenericEditor";
import {
  getContentNotePad,
  updateContentNotePad,
  clearContentNotePad,
} from "../lib/notepadApi";

const Page3 = () => (
  <div className="border-[2px] h-full border-gray-400 rounded-3xl">
    <GenericEditor
      title="Notepad"
      icon="ph:pencil-line-bold"
      queryKey="notepad"
      fetchContent={getContentNotePad}
      updateContent={updateContentNotePad}
      clearContent={clearContentNotePad}
    />
  </div>
);

export default Page3;
