import GenericEditor from "../components/GenericEditor/GenericEditor";
import {
  getContentIdea,
  updateContentIdea,
  clearContentIdea,
} from "../lib/notepadApi";

const Page14 = () => (
  <div className="border-[2px] h-full border-gray-400 rounded-3xl">
    <GenericEditor
      title="Ideas"
      icon="icons8:idea"
      queryKey="ideas"
      fetchContent={getContentIdea}
      updateContent={updateContentIdea}
      clearContent={clearContentIdea}
    />
  </div>
);

export default Page14;
