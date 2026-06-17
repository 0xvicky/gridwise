from dotenv import load_dotenv

load_dotenv()


def llm_query(system_prompt, user_query):
    from langchain_core.messages import HumanMessage, SystemMessage
    from langchain_groq import ChatGroq

    llm = ChatGroq(
        model="qwen/qwen3-32b",
        temperature=0,
        max_tokens=None,
        reasoning_format="parsed",
        timeout=None,
        max_retries=2,
        # other params...
    )
    
    response = llm.invoke(
        [SystemMessage(content=system_prompt), HumanMessage(content=user_query)]
    )
    return response.content
