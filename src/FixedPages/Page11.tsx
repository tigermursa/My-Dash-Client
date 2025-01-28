import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface Project {
  id: number;
  projectName: string;
  category: "frontend" | "backend" | "fullstack";
  githubClient?: string;
  githubServer?: string;
  liveLink?: string;
  priority: "low" | "medium" | "high";
  status: "planned" | "in-progress" | "completed";
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<Project>({
    defaultValues: {
      projectName: "",
      category: "frontend",
      githubClient: "",
      githubServer: "",
      liveLink: "",
      priority: "medium",
      status: "planned",
    },
  });

  // Load projects from localStorage on component mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);

  // Save projects to localStorage whenever projects state changes
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const onSubmit = (data: Project) => {
    const project: Project = {
      ...data,
      id: Date.now(),
    };
    setProjects([project, ...projects]);
    reset();
    setIsModalOpen(false);
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 dark:bg-gray-900">
      {/* Add Project Button */}
      <motion.div
        className="mb-8 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2 bg-primary_one text-primarydarkbg rounded-lg hover:bg-primary_one transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Icon icon="mdi:plus" className="text-xl" />
          Add Project
        </motion.button>
      </motion.div>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 rounded-xl bg-primary_one/10 backdrop-blur-sm border border-primary_one/30"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary_one">
                    Add New Project
                  </h2>
                  <button
                    type="button"
                    className="text-primary_one/50 hover:text-primary_one"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <Icon icon="mdi:close" className="text-2xl" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Name */}
                  <div className="relative">
                    <Icon
                      icon="mdi:folder-outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="projectName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Project Name"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        />
                      )}
                    />
                  </div>

                  {/* Category */}
                  <div className="relative">
                    <Icon
                      icon="mdi:tag-outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        >
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="fullstack">Fullstack</option>
                        </select>
                      )}
                    />
                  </div>

                  {/* GitHub Client */}
                  <div className="relative">
                    <Icon
                      icon="mdi:git"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="githubClient"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="url"
                          placeholder="GitHub Client (optional)"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        />
                      )}
                    />
                  </div>

                  {/* GitHub Server */}
                  <div className="relative">
                    <Icon
                      icon="mdi:git"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="githubServer"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="url"
                          placeholder="GitHub Server (optional)"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        />
                      )}
                    />
                  </div>

                  {/* Live Link */}
                  <div className="relative">
                    <Icon
                      icon="mdi:web"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="liveLink"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="url"
                          placeholder="Live Link (optional)"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        />
                      )}
                    />
                  </div>

                  {/* Priority */}
                  <div className="relative">
                    <Icon
                      icon="mdi:priority-high"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      )}
                    />
                  </div>

                  {/* Status */}
                  <div className="relative">
                    <Icon
                      icon="mdi:progress-check"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-primary_one/80"
                    />
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-primarydarkbg text-primary_one border border-primary_one focus:outline-none focus:border-primary_one"
                        >
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-6 py-2 text-primary_one hover:bg-primary_one/20 rounded-lg transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-primary_one text-primarydarkbg rounded-lg hover:bg-primary_one transition-colors"
                  >
                    Add Project
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg bg-primary_one/10 backdrop-blur-sm border border-primary_one/30"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-primary_one">
                {project.projectName}
              </h3>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-primary_one/50 hover:text-primary_one"
              >
                <Icon icon="mdi:delete" className="text-xl" />
              </button>
            </div>
            <p className="text-sm text-primary_one/80 mb-2">
              Category: {project.category}
            </p>
            <p className="text-sm text-primary_one/80 mb-2">
              Priority: {project.priority}
            </p>
            <p className="text-sm text-primary_one/80 mb-2">
              Status: {project.status}
            </p>
            {project.githubClient && (
              <a
                href={project.githubClient}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary_one/80 hover:text-primary_one"
              >
                GitHub Client
              </a>
            )}
            {project.githubServer && (
              <a
                href={project.githubServer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary_one/80 hover:text-primary_one"
              >
                GitHub Server
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary_one/80 hover:text-primary_one"
              >
                Live Link
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
