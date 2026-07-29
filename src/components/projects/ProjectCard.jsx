import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg
                 hover:shadow-2xl transition-all duration-300"
    >
      {/* تصویر پروژه */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110
                     transition-transform duration-500"
        />

        {/* Overlay روی تصویر */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        flex items-end justify-center pb-4 gap-4">
          {/* لینک GitHub */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 hover:bg-white p-3 rounded-full
                         transform hover:scale-110 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub className="text-gray-800 text-xl" />
            </a>
          )}

          {/* لینک Demo */}
          {project.demo && (
            project.isInternal ? (
              <Link
                to={project.demo}
                className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full
                           transform hover:scale-110 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt className="text-white text-xl" />
              </Link>
            ) : (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full
                           transform hover:scale-110 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt className="text-white text-xl" />
              </a>
            )
          )}
        </div>
      </div>

      {/* محتوای کارت */}
      <div className="p-6">
        {/* دسته‌بندی */}
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600
                         bg-blue-100 dark:bg-blue-900 dark:text-blue-300
                         rounded-full mb-3">
          {project.category}
        </span>

        {/* عنوان */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2
                       hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {project.title}
        </h3>

        {/* توضیحات */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* تکنولوژی‌ها */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700
                         text-gray-700 dark:text-gray-300 rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* دکمه مشاهده جزئیات */}
        {project.isInternal ? (
          <Link
            to={project.demo}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400
                       hover:gap-3 transition-all font-semibold"
          >
            مشاهده پروژه
            <span>←</span>
          </Link>
        ) : (
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400
                       hover:gap-3 transition-all font-semibold"
          >
            مشاهده جزئیات
            <span>←</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
