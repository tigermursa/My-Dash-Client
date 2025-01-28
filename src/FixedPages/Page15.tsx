import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const Help = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen p-4 md:p-8  dark:bg-gray-900 flex items-center justify-center">
      <motion.div
        className="max-w-2xl w-full p-6 md:p-8 rounded-xl bg-primary_one/10 backdrop-blur-sm border border-primary_one/30"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <Icon
            icon="mdi:help-circle-outline"
            className="text-6xl text-primary_one mx-auto"
          />
          <motion.h1
            className="text-3xl font-bold text-primary_one mt-4"
            variants={itemVariants}
          >
            Welcome to Mydash
          </motion.h1>
          <motion.p className="dark:text-white mt-2" variants={itemVariants}>
            Your personal dashboard to boost and maintain your progress.
          </motion.p>
        </motion.div>

        {/* Description */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.p className="dark:text-white" variants={itemVariants}>
            Mydash is designed to help you stay organized, track your goals, and
            manage your tasks efficiently. Whether you're working on projects,
            tracking important dates, or saving useful links, Mydash is here to
            make your life easier.
          </motion.p>
          <motion.p className="text-white" variants={itemVariants}>
            If you ever feel stuck or need assistance, don't hesitate to reach
            out. We're here to help!
          </motion.p>
        </motion.div>

        {/* Contact Section */}
        <motion.div className="mt-8" variants={itemVariants}>
          <motion.h2
            className="text-xl font-semibold text-primary_one mb-4"
            variants={itemVariants}
          >
            Need Help? Contact Us
          </motion.h2>
          <motion.div className="space-y-4" variants={containerVariants}>
            {/* Developer Info */}
            <motion.div
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              <Icon icon="mdi:account" className="text-2xl dark:text-white" />
              <div>
                <p className="text-primary_one">Mursalin Hossain</p>
                <p className="dark:text-white">Developer</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              <Icon
                icon="mdi:email-outline"
                className="text-2xl dark:text-white"
              />
              <motion.a
                href="mailto:mursalinhossain377@gmail.com"
                className="text-primary_one hover:text-primary_one transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                mursalinhossain377@gmail.com
              </motion.a>
            </motion.div>

            {/* Portfolio */}
            <motion.div
              className="flex items-center gap-4"
              variants={itemVariants}
            >
              <Icon icon="mdi:web" className="text-2xl dark:text-white" />
              <motion.a
                href="https://mursalinhossain.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary_one hover:text-primary_one transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Visit My Portfolio
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center dark:text-white"
          variants={itemVariants}
        >
          <p>© {new Date().getFullYear()} Mydash. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Help;
