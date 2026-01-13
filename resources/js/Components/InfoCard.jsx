function InfoCard({ title, text, textColor }) {
    return (
        <div className="bg-white  dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-gray-600 mb-2 dark:text-white">
                {title}
            </div>
            <div
                className={`text-xl font-bold ${
                    textColor ? textColor : "text-gray-600 dark:text-white"
                } `}
            >
                {text}
            </div>
        </div>
    );
}

export default InfoCard;
